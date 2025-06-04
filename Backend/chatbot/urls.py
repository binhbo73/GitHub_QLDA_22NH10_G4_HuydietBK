from django.urls import path
from .views import QAView, ChatSessionIdAPIView, ChatSessionAPIView, QAPairsAPIView

urlpatterns = [
    path('qa/', view=QAView.as_view(), name='qa-view'),
    path('qa-pairs/<str:chat_session_id>/', view=QAPairsAPIView.as_view(), name='qa-pairs-view'),
    path('chat-session/<str:chat_session_id>/', view=ChatSessionIdAPIView.as_view(), name='qa-session-view'),
    path('all-chat-session/<str:user_id>/', view=ChatSessionAPIView.as_view(), name='get-all-chat-session')
]
