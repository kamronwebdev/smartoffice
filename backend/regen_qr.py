import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from core.models import BusinessCenter, OfficeRoom

for room in OfficeRoom.objects.all():
    room.save()
    print(f"Renegerated QR for room: {room.id}")
