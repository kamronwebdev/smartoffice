from rest_framework import viewsets, permissions, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import BusinessCenter, OfficeRoom, RoomType
from .serializers import BusinessCenterSerializer, OfficeRoomSerializer, UserSerializer, RoomTypeSerializer
from .permissions import IsSuperAdminOrCenterAdminOrReadOnly

class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'id': user.id,
            'username': user.username,
            'is_superuser': user.is_superuser,
            'is_staff': user.is_staff
        })

class UserViewSet(viewsets.ModelViewSet):
    """
    Superadmin uchun tizimdagi barcha adminlarni o'qish, qo'shish, o'zgartirish va o'chirish API-si
    """
    queryset = User.objects.filter(is_superuser=False).order_by('username')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]

class UserCreateView(generics.CreateAPIView):
    """
    Yangi foydalanuvchilarni (yoki adminlarni) ro'yxatdan o'tkazish (Signup) API
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny] # Hamma ro'yxatdan o'ta oladi

class RoomTypeViewSet(viewsets.ModelViewSet):
    """
    Xona turlari uchun API ViewSet
    """
    queryset = RoomType.objects.all().order_by('name')
    serializer_class = RoomTypeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = super().get_queryset()
        business_center_id = self.request.query_params.get('business_center', None)
        if business_center_id:
            queryset = queryset.filter(business_center_id=business_center_id)
        return queryset

class BusinessCenterViewSet(viewsets.ModelViewSet):
    """
    Biznes markazlar ro'yxati va ditsillari uchun API ViewSet
    """
    serializer_class = BusinessCenterSerializer
    permission_classes = [IsSuperAdminOrCenterAdminOrReadOnly]

    def get_queryset(self):
        queryset = BusinessCenter.objects.all().order_by('-created_at')
        if self.request.query_params.get('managed_by_me') == 'true' and self.request.user.is_authenticated:
            if not self.request.user.is_superuser:
                queryset = queryset.filter(admins=self.request.user)
        return queryset

    def perform_create(self, serializer):
        # Oddiy admin yaratayotgan bo'lsa o'ziga biriktiriladi
        admin_user = self.request.user if not self.request.user.is_superuser else None
        # Agar payload ichida admin berilmagan bo'lsa, o'zini admin qiladi
        business_center = serializer.save()
        if 'admins' not in self.request.data and admin_user:
            business_center.admins.add(admin_user)

class OfficeRoomViewSet(viewsets.ModelViewSet):
    """
    Ofis xonalari ro'yxati, filtrlash va detal ma'lumotlar uchun API ViewSet
    """
    queryset = OfficeRoom.objects.all().order_by('room_number')
    serializer_class = OfficeRoomSerializer
    permission_classes = [IsSuperAdminOrCenterAdminOrReadOnly]
    
    # Qaysi biznes markazga tegishli ekanligi orqali filtrlash
    def get_queryset(self):
        queryset = super().get_queryset()
        business_center_id = self.request.query_params.get('business_center', None)
        status = self.request.query_params.get('status', None)
        
        if business_center_id:
            queryset = queryset.filter(business_center_id=business_center_id)
        if status:
            queryset = queryset.filter(status=status)
            
        return queryset

    def perform_create(self, serializer):
        from rest_framework.exceptions import PermissionDenied
        business_center = serializer.validated_data.get('business_center')
        
        if not self.request.user.is_superuser:
            if not business_center.admins.filter(id=self.request.user.id).exists():
                raise PermissionDenied("Siz faqat o'zingizning biznes markazingizga xona qo'sha olasiz.")

        serializer.save()

