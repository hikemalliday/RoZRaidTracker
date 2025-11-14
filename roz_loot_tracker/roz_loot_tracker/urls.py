"""
URL configuration for roz_loot_tracker project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.shortcuts import render
from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework import routers
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from app.rest.views import ItemViewSet, ZoneViewSet, PlayerViewSet, CharacterViewSet, RaidViewSet, ItemAwardedViewSet, \
    PreferredPixelViewSet, RaidAttendanceViewSet, RaidAttendanceApprovalViewSet
from django.views.decorators.csrf import csrf_exempt


def index_view(request):
    return render(request, "index.html")

router = routers.DefaultRouter()
router.register(r'items', ItemViewSet)
router.register(r'zones', ZoneViewSet)
router.register(r'players', PlayerViewSet)
router.register(r'characters', CharacterViewSet)
router.register(r'raids', RaidViewSet)
router.register(r'items_awarded', ItemAwardedViewSet)
router.register(r'preferred_pixels', PreferredPixelViewSet)
router.register(r'raid_attendance', RaidAttendanceViewSet)
router.register(r'raid_attendance_approval', RaidAttendanceApprovalViewSet)

urlpatterns = [
    path("api/", include(router.urls)),
    path('admin/', admin.site.urls),
    path('api/token/', csrf_exempt(TokenObtainPairView.as_view()), name='token_obtain_pair'),
    path('api/token/refresh/', csrf_exempt(TokenRefreshView.as_view()), name='token_refresh'),
    re_path(r'^.*$', index_view),
]
