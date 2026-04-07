from django.db import models
from django.contrib.auth.models import User
import qrcode
from io import BytesIO
from django.core.files import File

class AdminProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='admin_profile')
    raw_password = models.CharField(max_length=128, blank=True, null=True, verbose_name="Ochiq Parol (Faqat ko'rish uchun)")

    def __str__(self):
        return f"{self.user.username} profili"

class BusinessCenter(models.Model):
    name = models.CharField(max_length=255, verbose_name="Nomi")
    description = models.TextField(verbose_name="Tavsifi")
    address = models.CharField(max_length=500, verbose_name="Manzili")
    total_floors = models.IntegerField(verbose_name="Qavatlar soni", default=1)
    map_link = models.URLField(max_length=1000, blank=True, null=True, verbose_name="Xarita havolasi (Google/Yandex)", help_text="Masalan: https://yandex.uz/maps/...")
    contact_phone = models.CharField(max_length=50, verbose_name="Telefon raqami", blank=True, null=True)
    admins = models.ManyToManyField(User, related_name='managed_centers', blank=True, verbose_name="Markaz Adminlari")
    logo = models.ImageField(upload_to='center_logos/', blank=True, null=True, verbose_name="Markaz Logotipi")
    building_image = models.ImageField(upload_to='center_images/', blank=True, null=True, verbose_name="Bino Rasmi")
    qr_code = models.ImageField(upload_to='center_qr_codes/', blank=True, null=True, verbose_name="QR kod")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        
        # QR Code generatsiyasi faqat id shakllanganda va rasmi yo'q bo'lsa
        if self.id and not self.qr_code:
            qr = qrcode.QRCode(
                version=1,
                error_correction=qrcode.constants.ERROR_CORRECT_L,
                box_size=10,
                border=4,
            )
            # URL format misoli (frontenddagi manzil):
            qr_data = f"https://smartoffice-virid.vercel.app/center/{self.id}"
            qr.add_data(qr_data)
            qr.make(fit=True)

            img = qr.make_image(fill_color="black", back_color="white")
            buffer = BytesIO()
            img.save(buffer, format='PNG')
            file_name = f'qrcode_center_{self.id}.png'
            self.qr_code.save(file_name, File(buffer), save=True)

    def __str__(self):
        return self.name

class RoomType(models.Model):
    business_center = models.ForeignKey(BusinessCenter, on_delete=models.CASCADE, related_name='room_types', verbose_name="Biznes Markaz")
    name = models.CharField(max_length=100, verbose_name="Xona turi nomi")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.business_center.name})"

class OfficeRoom(models.Model):
    STATUS_CHOICES = (
        ('AVAILABLE', 'Available'),
        ('OCCUPIED', 'Occupied'),
        ('MAINTENANCE', 'Maintenance'),
    )
    
    PRICE_PERIOD_CHOICES = (
        ('HOURLY', 'Soatlik'),
        ('DAILY', 'Kunlik'),
        ('MONTHLY', 'Oylik'),
    )

    business_center = models.ForeignKey(BusinessCenter, on_delete=models.CASCADE, related_name='rooms', verbose_name="Biznes Markaz")
    room_type = models.ForeignKey(RoomType, on_delete=models.SET_NULL, null=True, blank=True, related_name='rooms', verbose_name="Xona turi")
    room_number = models.CharField(max_length=50, verbose_name="Xona raqami")   
    floor = models.DecimalField(max_digits=4, decimal_places=1, verbose_name="Qavat (masalan: 1, 1.5, 2)")
    area = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Maydoni (kv.m)")
    price = models.DecimalField(max_digits=12, decimal_places=2, verbose_name="Narxi", blank=True, null=True)
    price_period = models.CharField(max_length=20, choices=PRICE_PERIOD_CHOICES, default='MONTHLY', verbose_name="Narx muddati")
    currency = models.CharField(max_length=3, choices=[('UZS', 'UZS'), ('USD', 'USD')], default='UZS', verbose_name="Valyuta")
    capacity = models.IntegerField(verbose_name="Odam sig'imi")
    description = models.TextField(verbose_name="Xona haqida ma'lumot", blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='AVAILABLE')
    assigned_to = models.CharField(max_length=255, verbose_name="Kimga ijaraga berilgan", blank=True, null=True, help_text="Agar status 'Occupied' bo'lsa, mijoz ismini kiriting")
    qr_code = models.ImageField(upload_to='qr_codes/', blank=True, null=True, verbose_name="QR kod")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        # Asosiy saqlash amaliyoti (id generatsiya bo'lishi uchun)
        super().save(*args, **kwargs)
        
        # QR Code generatsiyasi
        if self.id and not self.qr_code:
            qr = qrcode.QRCode(
                version=1,
                error_correction=qrcode.constants.ERROR_CORRECT_L,
                box_size=10,
                border=4,
            )
            # URL format misoli (frontenddagi manzil):
            qr_data = f"https://smartoffice-virid.vercel.app/room/{self.id}"
            qr.add_data(qr_data)
            qr.make(fit=True)

            img = qr.make_image(fill_color="black", back_color="white")
            buffer = BytesIO()
            img.save(buffer, format='PNG')
            file_name = f'qrcode_room_{self.id}.png'
            self.qr_code.save(file_name, File(buffer), save=True)

    def __str__(self):
        return f"{self.business_center.name} - Xona {self.room_number}"

class RoomImage(models.Model):
    room = models.ForeignKey(OfficeRoom, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='room_images/')
    is_main = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.room.room_number} rasmi"


from django.db.models.signals import m2m_changed
from django.dispatch import receiver
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings

@receiver(m2m_changed, sender=BusinessCenter.admins.through)
def send_email_to_new_admins(sender, instance, action, pk_set, **kwargs):
    if action == "post_add" and pk_set:
        for user_id in pk_set:
            user = User.objects.filter(id=user_id).first()
            if user and getattr(user, 'email', None):
                name_to_use = user.first_name if user.first_name else user.username
                subject = f"{instance.name} markaziga admin etib tayinlandingiz"
                
                # HTML shablon render
                html_message = render_to_string('core/email/admin_assigned.html', {
                    'name': name_to_use,
                    'center_name': instance.name
                })
                # Matn versiyasi (HTML bo'lsa ko'rinishi uchun back-up)
                plain_message = strip_tags(html_message)
                
                try:
                    send_mail(
                        subject=subject,
                        message=plain_message,
                        from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'admin@smartoffice'),
                        recipient_list=[user.email],
                        html_message=html_message,
                        fail_silently=True,
                    )
                except Exception as e:
                    print(f"Xabarnoma jo'natishda xatolik: {e}")
