from django.urls import path
from .views import UserAPIView, GoogleLoginAPIView

urlpatterns = [
    path('users/', view=UserAPIView.as_view()),
    path('auth/google/', view=GoogleLoginAPIView.as_view(), name='google-login'),
]