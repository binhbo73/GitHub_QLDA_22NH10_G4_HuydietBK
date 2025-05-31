from channels.generic.websocket import AsyncWebsocketConsumer
import json

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # self.user_id = self.scope['url_route']['kwargs']['user_id']  # Lấy user_id từ URL
        # self.group_name = f"user_{self.user_id}"

        # await self.channel_layer.group_add(
        #     self.group_name,
        #     self.channel_name
        # )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get("message")

        # Echo lại cho client
        await self.send(text_data=json.dumps({
            'message': message
        }))

    async def send_message(self, event):
        message = event['message']
        await self.send(text_data=json.dumps({
            'message': message
        }))