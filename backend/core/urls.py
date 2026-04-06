from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import BusinessCenterViewSet, OfficeRoomViewSet, RoomTypeViewSet, UserCreateView, CurrentUserView, UserViewSet

router = DefaultRouter()
router.register('business-centers', BusinessCenterViewSet, basename='business-centers')
router.register('rooms', OfficeRoomViewSet, basename='rooms')
router.register('room-types', RoomTypeViewSet, basename='room-types')
router.register('users', UserViewSet, basename='users')

urlpatterns = [
    path('me/', CurrentUserView.as_view(), name='current_user'),
    path('signup/', UserCreateView.as_view(), name='signup'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include(router.urls)),
]


