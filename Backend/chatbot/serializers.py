from rest_framework import serializers
from .models import ChatSession, QA
from datetime import datetime

class QASerializer(serializers.Serializer):
    id = serializers.UUIDField(read_only=True)
    question = serializers.CharField()
    answer = serializers.CharField(allow_null=True, required=False)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)

class ChatSessionSerializer(serializers.Serializer):
    id = serializers.UUIDField(read_only=True)
    user_id = serializers.UUIDField()
    qa_pairs = serializers.ListField(
        child=QASerializer(),
        allow_empty=True,
        required=False
    )
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)

    def create(self, validated_data):
        qa_data = validated_data.pop('qa_pairs', [])
        session = ChatSession(**validated_data)
        session.qa_pairs = [QA(**qa) for qa in qa_data]
        session.save()
        return session

    def update(self, instance, validated_data):
        instance.user_id = validated_data.get('user_id', instance.user_id)
        qa_data = validated_data.get('qa_pairs')
        if qa_data is not None:
            instance.qa_pairs = [QA(**qa) for qa in qa_data]
        instance.updated_at = datetime.utcnow()
        instance.save()
        return instance
    
class ChatSessionELementSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    title = serializers.CharField()
    updated_at = serializers.DateTimeField(read_only=True)

    def validate(self, data):
        if not data.get('chat_session_id'):
            raise serializers.ValidationError("chat_session_id is required")
        if not data.get('qa_id'):
            raise serializers.ValidationError("qa_id is required")
        if not data.get('new_answer'):
            raise serializers.ValidationError("new_answer is required")
        return data