from django.urls import path
from .views import (
    ShortURLCreateAPIView,
    ShortURLDetailAPIView,
    ShortURLStatsAPIView,
    ShortURListAPIView 
)

urlpatterns = [
    path('urls/',ShortURListAPIView.as_view(),name='urls'),
    path('shorten/', ShortURLCreateAPIView.as_view(), name='shorten-create'),
    path('shorten/<str:short_code>/', ShortURLDetailAPIView.as_view(), name='shorten-detail'),
    path('shorten/<str:short_code>/stats/', ShortURLStatsAPIView.as_view(), name='shorten-stats')
]