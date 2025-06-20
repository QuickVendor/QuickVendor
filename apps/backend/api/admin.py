from django.contrib import admin
from core.admin import BaseModelAdmin
from .models import APIKey, SystemConfiguration, APIRequestLog


@admin.register(APIKey)
class APIKeyAdmin(BaseModelAdmin):
    list_display = ['name', 'service', 'status_display', 'created_date']
    list_filter = ['service', 'is_active', 'created_at']
    search_fields = ['name', 'service']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(SystemConfiguration)
class SystemConfigurationAdmin(BaseModelAdmin):
    list_display = ['key', 'value', 'status_display', 'created_date']
    search_fields = ['key', 'description']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(APIRequestLog)
class APIRequestLogAdmin(admin.ModelAdmin):
    list_display = ['endpoint', 'method', 'status_code', 'response_time', 'ip_address', 'created_date']
    list_filter = ['method', 'status_code', 'created_at']
    search_fields = ['endpoint', 'ip_address']
    readonly_fields = ['endpoint', 'method', 'status_code', 'response_time', 'user_agent', 'ip_address', 'created_at', 'updated_at']
    
    def created_date(self, obj):
        """Display formatted creation date in admin list view."""
        if obj.created_at:
            return obj.created_at.strftime('%Y-%m-%d %H:%M')
        return '-'
    created_date.short_description = 'Created'