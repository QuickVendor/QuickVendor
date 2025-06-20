from django.urls import path
from . import views

app_name = 'api'

urlpatterns = [
    # Health check endpoint
    path('health/', views.health_check, name='health_check'),
    
    # Statistics endpoint
    path('stats/', views.api_stats, name='api_stats'),
    
    # Configuration endpoints
    path('config/', views.SystemConfigurationListView.as_view(), name='system_config_list'),
    
    # API Key management
    path('keys/', views.APIKeyListView.as_view(), name='api_key_list'),
]