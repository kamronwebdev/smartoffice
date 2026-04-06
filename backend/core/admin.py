from django.contrib import admin
from .models import BusinessCenter, OfficeRoom, RoomImage

class RoomImageInline(admin.TabularInline):
    model = RoomImage
    extra = 1

@admin.register(BusinessCenter)
class BusinessCenterAdmin(admin.ModelAdmin):
    list_display = ('name', 'address', 'contact_phone', 'display_admins')
    search_fields = ('name', 'address')

    def display_admins(self, obj):
        return ", ".join([admin.username for admin in obj.admins.all()])
    display_admins.short_description = 'Admins'

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(admins=request.user)

    def has_module_permission(self, request):
        return request.user.is_authenticated and request.user.is_staff

    def has_view_permission(self, request, obj=None):
        return True

    def has_change_permission(self, request, obj=None):
        if request.user.is_superuser:
            return True
        if obj is not None and not obj.admins.filter(id=request.user.id).exists():
            return False
        return True

    def has_add_permission(self, request):
        return request.user.is_superuser

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser


@admin.register(OfficeRoom)
class OfficeRoomAdmin(admin.ModelAdmin):
    list_display = ('room_number', 'business_center', 'floor', 'area', 'price', 'currency', 'status', 'assigned_to')
    list_filter = ('status', 'floor', 'currency')
    search_fields = ('room_number', 'description', 'assigned_to')
    inlines = [RoomImageInline]
    readonly_fields = ('qr_code',)

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(business_center__admins=request.user)

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "business_center":
            if not request.user.is_superuser:
                kwargs["queryset"] = BusinessCenter.objects.filter(admins=request.user)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

    def has_module_permission(self, request):
        return request.user.is_authenticated and request.user.is_staff

    def has_view_permission(self, request, obj=None):
        return True

    def has_add_permission(self, request):
        return True

    def has_change_permission(self, request, obj=None):
        if request.user.is_superuser:
            return True
        if obj is not None and not obj.business_center.admins.filter(id=request.user.id).exists():
            return False
        return True

    def has_delete_permission(self, request, obj=None):
        if request.user.is_superuser:
            return True
        if obj is not None and not obj.business_center.admins.filter(id=request.user.id).exists():
            return False
        return True

