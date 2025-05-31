from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import QASerializer, ChatSessionSerializer
from .models import ChatSession, QA
from users.models import User
from datetime import datetime
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from uuid import UUID

class QAView(APIView):
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
        qa = QA(
            question=qa_data['question'],
            answer=None,
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
            chat_session = ChatSession(
                user_id=user_uuid,
                qa_pairs=[qa],
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            chat_session.save()

        # TODO: call event to generate answer for this question

        return Response({
            "message": "Question added to chat session",
            "chat_session_id": str(chat_session.id)
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
    
def send_message_to_user(user_id, message):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"user_{user_id}",
        {
            "type": "send_notification",
            "message": message
        }
    )
