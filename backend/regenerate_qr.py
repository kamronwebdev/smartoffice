import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from core.models import OfficeRoom, BusinessCenter

print("Regenerating all BusinessCenter and OfficeRoom QR codes...")

rooms = OfficeRoom.objects.all()
for room in rooms:
    room.qr_code.delete(save=False)
    room.save()

centers = BusinessCenter.objects.all()
for center in centers:
    center.qr_code.delete(save=False)
    center.save()

print("Done generating QR Codes!")
