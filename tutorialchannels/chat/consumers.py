import json
from .models import Chatroom
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
import requests

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        
        token = self.scope['query_string'].decode().split('=')[1]
        self.is_valid = await self.validate_jwt(token)
        print(self.is_valid)

        if self.is_valid:
            self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
            self.room_group_name = "chat_%s" % self.room_name

            await self.channel_layer.group_add(self.room_group_name, self.channel_name)


            await self.accept()

            # content = await self.get_room_content(self.room_name)
            # if content:
            #     await self.send(text_data=json.dumps({
            #         'message': content
            #     }))
        else:
            await self.close()

    async def disconnect(self, close_code):
        if self.is_valid:
            await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]

        #await self.save_message(self.room_name, message)

        await self.channel_layer.group_send(
            self.room_group_name, {"type": "chat_message", "message": message}
        )

    async def chat_message(self, event):
        message = event["message"]

        await self.send(text_data=json.dumps({"message": message}))

    @database_sync_to_async
    def save_message(self, roomname, message):
        room, created = Chatroom.objects.get_or_create(name=roomname)
        room.text = message
        room.save()

    async def get_room_content(self, roomname):
        try:
            room = await database_sync_to_async(Chatroom.objects.get)(name=roomname)
            return room.text
        except Chatroom.DoesNotExist:
            await database_sync_to_async(Chatroom.objects.create)(name=roomname, text="")
            return ""
        except Exception as e:
            print(f"An error occurred: {e}")
            return ""
        
    async def validate_jwt(self, token):
        try:
            url = "http://auth_service:4050/protected"
            headers = {"Authorization": f"Bearer {token}"}
            response = await database_sync_to_async(self._validate_jwt_sync)(url, headers)

            return response.status_code == 200
        except Exception as e:
            print(f"JWT validation failed: {e}")
            return False

    def _validate_jwt_sync(self, url, headers):
        return requests.get(url, headers=headers)