from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from pathlib import Path
from dotenv import load_dotenv
import os
import httpx
import json
from .serializers import QASerializer, ChatSessionSerializer, ChatSessionELementSerializer
from .models import ChatSession, QA
from users.models import User
from datetime import datetime
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import re
from chatbot.text_to_speech import text_to_speech_zalo

from uuid import UUID

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / '.env')

headers = {
    'Authorization': 'Bearer ' + os.getenv('OPENROUTER_API_KEY'),
    'Content-Type': 'application/json'
}

class QAView(APIView):
    # This function helps to generate the answer for the questions requested by the user.
    def generate_content_answer(self, model, question, user_id):
        full_answer = ""
        data = {
            "model": model,
            "messages": [
                {"role": "system", "content": "You are a professional assistant, your content will be posted on Facebook."},
                {"role": "user", "content": question}
            ],
            "stream": True
        }

        with httpx.stream("POST", os.getenv('OPENROUTER_API_URL'), headers=headers, json=data, timeout=60.0) as response:
            for line in response.iter_lines():
                if line.startswith("data: "):
                    raw = line.removeprefix("data: ").strip()
                    if raw == "[DONE]":
                        break
                    try:
                        content = json.loads(raw)["choices"][0]["delta"].get("content", "")
                        full_answer += content
                        # send_message_to_user(user_id, content)
                    except Exception as e:
                        print("Error processing response: " + str(e))
                        pass
        return full_answer

    def post(self, request):
        user_id = request.data.get('user_id')
        try:
            user_uuid = UUID(user_id)
        except (TypeError, ValueError):
            return Response({"error": "Invalid or missing user_id"}, status=status.HTTP_400_BAD_REQUEST)

        if not User.objects(id=user_uuid).first():
            return Response({"error": "User does not exist"}, status=status.HTTP_404_NOT_FOUND)
        
        qa_serializer = QASerializer(data=request.data)
        if not qa_serializer.is_valid():
            return Response(qa_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        qa_data = qa_serializer.validated_data
        answer = self.generate_content_answer(
            model=os.getenv('MODEL'),
            question=qa_data['question'],
            user_id=user_uuid
        )

        qa = QA(
            question=qa_data['question'],
            answer=answer,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )

        chat_session_id = request.data.get('chat_session_id')
        if chat_session_id:
            try:
                chat_session = ChatSession.objects.get(id=UUID(chat_session_id))
                chat_session.qa_pairs.append(qa)
                chat_session.save()
            except ChatSession.DoesNotExist:
                return Response({"error": "Chat session not found"}, status=status.HTTP_404_NOT_FOUND)
        else:
            title =  " ".join(qa.question.split()[:5])
            chat_session = ChatSession(
                user_id=user_uuid,
                qa_pairs=[qa],
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow(),
                title=title
            )
            chat_session.save()

        # TODO: call event to generate answer for this question

        return Response({
            "message": "Question added to chat session",
            "chat_session_id": str(chat_session.id),
            "question": qa.question,
            "answer": qa.answer,
            "question_id": str(qa.id),
            "user_id": user_uuid
        }, status=status.HTTP_201_CREATED)
    
    def put(self, request):
        chat_session_id = request.data.get('chat_session_id')
        qa_id = request.data.get('qa_id')
        new_answer = request.data.get('new_answer')

        if not (chat_session_id and qa_id and new_answer):
            return Response({"error": "chat_session_id, qa_id, and new_answer are required"},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            chat_session = ChatSession.objects.get(id=UUID(chat_session_id))
        except ChatSession.DoesNotExist:
            return Response({"error": "Chat session not found"}, status=status.HTTP_404_NOT_FOUND)

        for qa in chat_session.qa_pairs:
            if str(qa.id) == qa_id:
                qa.answer = new_answer
                qa.updated_at = datetime.utcnow()
                chat_session.updated_at = datetime.utcnow()
                chat_session.save()
                return Response({"message": "Answer updated successfully"}, status=status.HTTP_200_OK)

        return Response({"error": "QA not found in this chat session"}, status=status.HTTP_404_NOT_FOUND)
    
class ChatSessionIdAPIView(APIView):
    def get(self, request, chat_session_id):
        try:
            chat_session = ChatSession.objects.get(id=UUID(chat_session_id))
            serializer = ChatSessionSerializer(chat_session)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ChatSession.DoesNotExist:
            return Response({"error": "Chat session not found"}, status=status.HTTP_404_NOT_FOUND)

class QAPairsAPIView(APIView):
    def get(self, request, chat_session_id):
        try:
            chat_session = ChatSession.objects.get(id=UUID(chat_session_id))
            serializer = QASerializer(chat_session.qa_pairs, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ChatSession.DoesNotExist:
            return Response({"error": "Chat session not found"}, status=status.HTTP_404_NOT_FOUND)

class ChatSessionAPIView(APIView):
    def get(self, request, user_id):
        print(user_id)
        try:
            chat_sessions = ChatSession.objects.filter(user_id=UUID(user_id))
            serializer = ChatSessionELementSerializer(chat_sessions, many=True)
            print(serializer.data)
            return Response([{
                "id": str(session.get("id")),
                "title": session.get("title"),
                "type": "general",
                "timestamp": session.get("updated_at")
            } for session in serializer.data], status=status.HTTP_200_OK)
        except ChatSession.DoesNotExist:
            print("error occured")
            return Response({"error": "No chat session found for this user"}, status=status.HTTP_404_NOT_FOUND)
        
class TextToSpeechAPIView(APIView):
    def clean_text(self, text):
        return re.sub(r'(\*{1,3}|~{2})(.+?)\1', r'\2', text)

    def post(self, request):
        text = request.data.get('text')
        if not text:
            return Response({"error": "Text is required"}, status=status.HTTP_400_BAD_REQUEST)
        text = self.clean_text(text)
        # url = text_to_speech_zalo(text)
        url = "https://chunk-v3.tts.zalo.ai/secure/d2d881985de5b4bbedf4/d2d881985de5b4bbedf4.wav?expires=1749721001&md5=AQonJc4I9rdXux88AZg3zw"
        if not url:
            return Response({"error": "Failed to generate audio"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response({"audio_url": url}, status=status.HTTP_200_OK)
    
class SpeechToTextAPIView(APIView):
    def post(self, request):
        audio_file = request.FILES.get('audio')
        if not audio_file:
            return Response({"error": "Audio file is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Here you would implement the logic to convert speech to text
        # For now, we will just return a placeholder response
        return Response({"text": "This is a placeholder for the converted text"}, status=status.HTTP_200_OK)


# Function to send a message to a user via WebSocket
def send_message_to_user(user_id, message):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"user_{user_id}",
        {
            "type": "send_notification",
            "message": message
        }
    )