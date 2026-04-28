from rest_framework import serializers
from django.contrib.auth.models import User
from .models import BusinessCenter, OfficeRoom, RoomImage, RoomType, AdminProfile

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    raw_password = serializers.SerializerMethodField()
    managed_centers = serializers.PrimaryKeyRelatedField(many=True, required=False, queryset=BusinessCenter.objects.all())

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'password', 'raw_password', 'managed_centers']

    def get_raw_password(self, obj):
        try:
            return obj.admin_profile.raw_password
        except AdminProfile.DoesNotExist:
            return ""

    def create(self, validated_data):
        managed_centers = validated_data.pop('managed_centers', [])
        password = validated_data.pop('password', None)
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            password=password
        )
        if password:
            AdminProfile.objects.create(user=user, raw_password=password)
        user.is_staff = True
        user.save()
        if managed_centers:
            user.managed_centers.set(managed_centers)
        return user

    def update(self, instance, validated_data):
        managed_centers = validated_data.pop('managed_centers', None)
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)
            profile, created = AdminProfile.objects.get_or_create(user=instance)
            profile.raw_password = password
            profile.save()

        instance.save()
        if managed_centers is not None:
            instance.managed_centers.set(managed_centers)
        return instance

class RoomImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomImage
        fields = ['id', 'image', 'is_main']

class RoomTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomType
        fields = '__all__'

class OfficeRoomSerializer(serializers.ModelSerializer):
    images = RoomImageSerializer(many=True, read_only=True)
    room_type_name = serializers.CharField(source='room_type.name', read_only=True)
    
    class Meta:
        model = OfficeRoom
        fields = '__all__'

class BusinessCenterSerializer(serializers.ModelSerializer):
    rooms = OfficeRoomSerializer(many=True, read_only=True)
    
    class Meta:
        model = BusinessCenter
        fields = '__all__'



