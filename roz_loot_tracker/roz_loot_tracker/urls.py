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

from django.contrib import admin
from django.urls import include, path
from django.views.decorators.csrf import csrf_exempt
from rest_framework import routers

from app.rest.views import (
    CharacterViewSet,
    CustomTokenObtainPairView,
    ItemAwardedViewSet,
    ItemViewSet,
    PlayerViewSet,
    PreferredPixelViewSet,
    RaidAttendanceApprovalViewSet,
    RaidAttendanceViewSet,
    RaidViewSet,
    SQLQueryViewSet,
    ZoneViewSet,
)

router = routers.DefaultRouter()
router.register(r"items", ItemViewSet)
router.register(r"zones", ZoneViewSet)
router.register(r"players", PlayerViewSet)
router.register(r"characters", CharacterViewSet)
router.register(r"raids", RaidViewSet)
router.register(r"items_awarded", ItemAwardedViewSet)
router.register(r"preferred_pixels", PreferredPixelViewSet)
router.register(r"raid_attendance", RaidAttendanceViewSet)
router.register(r"raid_attendance_approval", RaidAttendanceApprovalViewSet)
router.register(r"sql", SQLQueryViewSet, basename="sql")

urlpatterns = [
    path("api/", include(router.urls)),
    path("admin/", admin.site.urls),
    path("api/token/", csrf_exempt(CustomTokenObtainPairView.as_view()), name="token_obtain_pair"),
    path("api/token/refresh/", csrf_exempt(CustomTokenObtainPairView.as_view()), name="token_refresh"),
]
