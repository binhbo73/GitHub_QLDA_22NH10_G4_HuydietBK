from django.urls import path
from .views import UserAPIView

urlpatterns = [
    path('', view=UserAPIView.as_view()),
    # path('users/<str:pk>/', user_detail, name='user-detail'),
]