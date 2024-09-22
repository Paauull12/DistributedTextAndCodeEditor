from django.db import models

class Chatroom(models.Model):
    name = models.CharField(max_length=255)
    text = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name
