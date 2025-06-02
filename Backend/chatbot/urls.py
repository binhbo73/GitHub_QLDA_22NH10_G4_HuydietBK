from django.urls import path
from .views import QAView, ChatSessionIdAPIView

urlpatterns = [
    path('qa/', view=QAView.as_view(), name='qa-view'),
    path('chat-session/<str:chat_session_id>/', view=ChatSessionIdAPIView.as_view(), name='qa-session-view'),
]
