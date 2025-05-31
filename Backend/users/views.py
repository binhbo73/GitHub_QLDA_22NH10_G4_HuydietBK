from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from django.contrib.auth.hashers import check_password
from .models import User
from .serializers import UserSerializer
from datetime import datetime
import os

GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')

class UserAPIView(APIView):

    def get(self, request, format=None):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, format=None):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginAPIView(APIView):
    def post(self, request, format=None):
        email = request.data.get('email')
        password = request.data.get('password')
        print(f"Login with email: {email}")
        print(f"Login with password: {password}")

        if not all ([email, password]):
            print("Email or password is missing")
            return Response({'error': 'Email and password are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects(email=email).first()
        if user:
            serializer = UserSerializer(user)
            return Response({'user': serializer.data}, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)
    
class GoogleLoginAPIView(APIView):
    def post(self, request):
        token = request.data.get('token')
        if not token:
            return Response({"error": "Token is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), GOOGLE_CLIENT_ID)
            email = idinfo['email']
            name = idinfo.get('name', '')
            provider_id = idinfo['sub']
            avatar_url = idinfo.get('picture', '')
            print(f"Finding user with email: {email}")
            user = User.objects(email=email).first()
            print(f"User found: {user}")
            if not user:
                user = User(
                    email=email,
                    name=name,
                    provider='google',
                    provider_id=provider_id,
                    avatar_url=avatar_url
                )
                user.save()
            else:
                user.updated_at = datetime.utcnow()
                user.save()
            serializer = UserSerializer(user)
            return Response({'user': serializer.data}, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)