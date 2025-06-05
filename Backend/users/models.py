import uuid
from mongoengine import Document, StringField, EmailField, DateTimeField, UUIDField
from datetime import datetime

class User(Document):
    id = UUIDField(default=uuid.uuid4, primary_key=True)
    email = EmailField(required=True, unique=True)
    password = StringField()
    name = StringField(required=True)
    provider = StringField()
    provider_id = StringField()
    avatar_url = StringField()
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)

    meta = {'collection': 'users'}

    def __str__(self):
        return self.email