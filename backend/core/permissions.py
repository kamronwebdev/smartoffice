from rest_framework import permissions

class IsSuperAdminOrCenterAdminOrReadOnly(permissions.BasePermission):
    """
    Ruxsatlar (Permissions):
    - Oddiy foydalanuvchilar (Normal Users): faqat o'qish (GET) huquqiga ega.
    - Superadmin: barcha CRUD huquqiga ega.
    - Admin: faqat o'ziga biriktirilgan Business Center va uning ichidagi Ofislar ustida tahrirlash (PUT/PATCH) qila oladi. Boshqa narsalarga huquqi yo'q.
    """

    def has_permission(self, request, view):
        # Read-only so'rovlar barchaga ruxsat etiladi
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Yozish (create/update/delete) uchun avtorizatsiya talab qilinadi
        if not request.user or not request.user.is_authenticated:
            return False

        # Faqat Superadmin Business Center CREATE/DELETE qila oladi.
        if request.method in ['POST', 'DELETE'] and getattr(view, 'basename', None) == 'business-centers':
            return request.user.is_superuser

        # UPDATE (PUT/PATCH) ni alohida obyekt darajasida tekshiramiz
        return True

    def has_object_permission(self, request, view, obj):
        # O'qish huquqi barchaga
        if request.method in permissions.SAFE_METHODS:
            return True
            
        # Superadmin uchun hamma narsa ruxsat etilgan
        if request.user.is_superuser:
            return True

        # Admin faqat o'zining markazi ustida yoki uning xonalari ustida UPDATE/DELETE qila oladi
        if request.method in ['PUT', 'PATCH', 'DELETE']:
            if hasattr(obj, 'admins') and obj.admins.filter(id=request.user.id).exists():
                return True
            if hasattr(obj, 'business_center') and obj.business_center.admins.filter(id=request.user.id).exists():
                return True

        return False
