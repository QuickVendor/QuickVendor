from django.contrib import admin
from django.utils.html import format_html


class TimeStampedModelAdmin(admin.ModelAdmin):
    """
    Base admin class for models that inherit from TimeStampedModel.
    """
    readonly_fields = ('created_at', 'updated_at')
    
    def get_readonly_fields(self, request, obj=None):
        """
        Make timestamp fields readonly in admin.
        """
        readonly_fields = list(super().get_readonly_fields(request, obj))
        readonly_fields.extend(['created_at', 'updated_at'])
        return readonly_fields

    def created_date(self, obj):
        """
        Display formatted creation date in admin list view.
        """
        if obj.created_at:
            return obj.created_at.strftime('%Y-%m-%d %H:%M')
        return '-'
    created_date.short_description = 'Created'

    def updated_date(self, obj):
        """
        Display formatted update date in admin list view.
        """
        if obj.updated_at:
            return obj.updated_at.strftime('%Y-%m-%d %H:%M')
        return '-'
    updated_date.short_description = 'Updated'


class BaseModelAdmin(TimeStampedModelAdmin):
    """
    Base admin class for models that inherit from BaseModel.
    """
    list_filter = ('is_active', 'created_at', 'updated_at')
    
    def status_display(self, obj):
        """
        Display active status with colored indicator in admin.
        """
        if obj.is_active:
            return format_html(
                '<span style="color: green;">● Active</span>'
            )
        else:
            return format_html(
                '<span style="color: red;">● Inactive</span>'
            )
    status_display.short_description = 'Status'

    def get_list_display(self, request):
        """
        Add status display to list view.
        """
        list_display = list(super().get_list_display(request) or [])
        if 'status_display' not in list_display:
            list_display.append('status_display')
        return list_display