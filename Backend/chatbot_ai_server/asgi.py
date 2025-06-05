import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.urls import re_path
from .consumer import ChatConsumer

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chatbot_ai_server.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter([
            re_path(r"^ws/chat/(?P<user_id>[^/]+)/$", ChatConsumer.as_asgi()),
        ])
    ),
})