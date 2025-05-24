from rest_framework import serializers
from .models import User

class UserSerializer(serializers.Serializer):
    id = serializers.UUIDField(read_only=True)
    email = serializers.EmailField(required=True)
    name = serializers.CharField(required=True)
    provider = serializers.CharField(required=False, allow_blank=True)
    provider_id = serializers.CharField(required=False, allow_blank=True)
    avatar_url = serializers.URLField(required=False, allow_blank=True)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)

    def create(self, validated_data):
        user = User(**validated_data)
        user.save()
        return user

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
    
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'provider', 'provider_id', 'avatar_url', 'created_at', 'updated_at']