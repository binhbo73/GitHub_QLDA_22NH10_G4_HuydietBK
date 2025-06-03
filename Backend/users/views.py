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
import requests

GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
GOOGLE_USERINFO_ENDPOINT = os.getenv('GOOGLE_USERINFO_ENDPOINT')

class UserAPIView(APIView):

    def get(self, request, format=None):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, format=None):
        email = request.data.get('email')
        password = request.data.get('password')
        name = request.data.get('name')

        if not email or not password or not name: 
            return Response({'error': 'Email, password and name are required!'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects(email=email).first()

        if user:
            return Response ({'error': 'This email has been used before!'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginAPIView(APIView):
    def post(self, request, format=None):
        email = request.data.get('email')
        password = request.data.get('password')

        if not all ([email, password]):
            print("Email or password is missing")
            return Response({'error': 'Email and password are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects(email=email).first()
        if user:
            if not user.password:
                print("User uses Google to Login, so let's use Gmail to log in");
                return Response({"error": "Use your email or Google Account to log in"}, status=status.HTTP_400_BAD_REQUEST)
            
            serializer = UserSerializer(user)
            if not check_password(password, user.password):
                print("Password is incorrect")
                return Response({'error': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)
            return Response({'user': serializer.data}, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)
    
class GoogleLoginAPIView(APIView):
    def post(self, request):
        token = request.data.get('token')
        access_token = request.data.get('access_token')
        print(f"Google login with token: {token}")
        print(f"Google login with access_token: {access_token}")
        if not token and not access_token:
            return Response({"error": "Token or access_token is required"}, status=status.HTTP_400_BAD_REQUEST)
        if token:
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
        elif access_token:
            try:
                # Gửi request đến Google để lấy thông tin user
                headers = {'Authorization': f'Bearer {access_token}'}
                userinfo_response = requests.get(GOOGLE_USERINFO_ENDPOINT, headers=headers)

                if userinfo_response.status_code != 200:
                    return Response({"error": "Invalid access_token"}, status=status.HTTP_400_BAD_REQUEST)

                userinfo = userinfo_response.json()
                email = userinfo.get('email')
                name = userinfo.get('name', '')
                provider_id = userinfo.get('id')
                avatar_url = userinfo.get('picture', '')

                if not email:
                    return Response({"error": "Email not available from Google account"}, status=status.HTTP_400_BAD_REQUEST)

                # Check or create user
                user = User.objects(email=email).first()
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

            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    