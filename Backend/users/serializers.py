from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)

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