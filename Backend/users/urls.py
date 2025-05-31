from django.urls import path
from .views import UserAPIView, GoogleLoginAPIView, LoginAPIView

urlpatterns = [
    path('users/', view=UserAPIView.as_view()),
    path('login/', view=LoginAPIView.as_view(), name='login'),
    path('auth/google/', view=GoogleLoginAPIView.as_view(), name='google-login'),
]