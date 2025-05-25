import uuid
from mongoengine import Document, StringField, EmailField, DateTimeField, UUIDField
from datetime import datetime

class QA(Document):
    id = UUIDField(default=uuid.uuid4, primary_key=True)
    question = StringField(required=True)
    answer = StringField(required=True)
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)

    meta = {'collection': 'qa_pairs'}

    def __str__(self):
        return f"Q: {self.question} | A: {self.answer}"
    
class ChatSession(Document):
    id = UUIDField(default=uuid.uuid4, primary_key=True)
    user_id = UUIDField(required=True)
    qa_pairs = StringField(required=True)  # Store as JSON string or similar
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)

    meta = {'collection': 'chat_sessions'}

    def __str__(self):
        return f"Session ID: {self.id} | User ID: {self.user_id}"