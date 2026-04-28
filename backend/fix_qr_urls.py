import os
import django
import sys
from io import BytesIO

# Django sozlamalarini yuklash
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from core.models import BusinessCenter, OfficeRoom
import qrcode
from django.core.files import File

def update_qrcodes():
    base_url = "https://smartoffice-virid.vercel.app"
    
    print("Markazlar QR kodlari yangilanmoqda...")
    for center in BusinessCenter.objects.all():
        qr = qrcode.QRCode(version=1, error_correction=qrcode.constants.ERROR_CORRECT_L, box_size=10, border=4)
        qr.add_data(f"{base_url}/center/{center.id}")
        qr.make(fit=True)
        img = qr.make_image(fill_color="black", back_color="white")
        
        buffer = BytesIO()
        img.save(buffer, format='PNG')
        
        # Eskisini o'chirish va yangisini saqlash
        if center.qr_code:
            center.qr_code.delete(save=False)
            
        center.qr_code.save(f'qrcode_center_{center.id}.png', File(buffer), save=True)
        print(f" [+] Yangilandi: {center.name}")

    print("\nXonalar QR kodlari yangilanmoqda...")
    for room in OfficeRoom.objects.all():
        qr = qrcode.QRCode(version=1, error_correction=qrcode.constants.ERROR_CORRECT_L, box_size=10, border=4)
        qr.add_data(f"{base_url}/room/{room.id}")
        qr.make(fit=True)
        img = qr.make_image(fill_color="black", back_color="white")
        
        buffer = BytesIO()
        img.save(buffer, format='PNG')
        
        if room.qr_code:
            room.qr_code.delete(save=False)
            
        room.qr_code.save(f'qrcode_room_{room.id}.png', File(buffer), save=True)
        print(f" [+] Yangilandi: {room.business_center.name} - {room.room_number}")

if __name__ == '__main__':
    update_qrcodes()
    print("\nBarcha QR kodlar muvaffaqiyatli Vercel manziliga o'zgartirildi!")
