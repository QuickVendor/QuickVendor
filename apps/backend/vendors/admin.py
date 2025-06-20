from django.contrib import admin
from core.admin import BaseModelAdmin
from .models import Vendor, VendorBankAccount, VendorSettings, VendorProfile


@admin.register(VendorProfile)
class VendorProfileAdmin(admin.ModelAdmin):
    list_display = [
        'business_name', 
        'user_id', 
        'slug', 
        'whatsapp', 
        'bank_name', 
        'has_complete_banking_info',
        'is_active', 
        'created_at'
    ]
    list_filter = ['is_active', 'bank_name', 'created_at', 'updated_at']
    search_fields = ['business_name', 'slug', 'whatsapp', 'account_name']
    readonly_fields = ['user_id', 'slug', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('user_id', 'business_name', 'slug', 'is_active')
        }),
        ('Contact Information', {
            'fields': ('whatsapp',)
        }),
        ('Banking Information', {
            'fields': ('bank_name', 'account_number', 'account_name'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def has_complete_banking_info(self, obj):
        """Display whether vendor has complete banking info."""
        return all([obj.bank_name, obj.account_number, obj.account_name])
    has_complete_banking_info.boolean = True
    has_complete_banking_info.short_description = 'Banking Complete'

    def get_readonly_fields(self, request, obj=None):
        """Make user_id readonly only when editing existing objects."""
        if obj:  # Editing existing object
            return self.readonly_fields
        else:  # Creating new object
            return ['slug', 'created_at', 'updated_at']


class VendorBankAccountInline(admin.TabularInline):
    model = VendorBankAccount
    extra = 1
    fields = ['bank_name', 'account_name', 'account_number', 'is_primary', 'is_verified']


class VendorSettingsInline(admin.StackedInline):
    model = VendorSettings
    fields = ['email_notifications', 'sms_notifications', 'min_order_amount', 'processing_time', 'return_policy']


@admin.register(Vendor)
class VendorAdmin(BaseModelAdmin):
    list_display = ['business_name', 'email', 'city', 'is_verified', 'is_approved', 'status_display', 'created_date']
    list_filter = ['is_verified', 'is_approved', 'is_active', 'country', 'state', 'created_at']
    search_fields = ['business_name', 'email', 'phone', 'city']
    prepopulated_fields = {'slug': ('business_name',)}
    inlines = [VendorBankAccountInline, VendorSettingsInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('business_name', 'slug', 'description', 'logo', 'banner')
        }),
        ('Contact Information', {
            'fields': ('email', 'phone', 'website')
        }),
        ('Address', {
            'fields': ('address_line_1', 'address_line_2', 'city', 'state', 'postal_code', 'country')
        }),
        ('Business Details', {
            'fields': ('tax_id', 'registration_number')
        }),
        ('Status', {
            'fields': ('is_verified', 'is_approved', 'is_active')
        }),
    )


@admin.register(VendorBankAccount)
class VendorBankAccountAdmin(BaseModelAdmin):
    list_display = ['vendor', 'bank_name', 'account_name', 'is_primary', 'is_verified', 'status_display', 'created_date']
    list_filter = ['bank_name', 'is_primary', 'is_verified', 'is_active', 'created_at']
    search_fields = ['vendor__business_name', 'bank_name', 'account_name', 'account_number']
    raw_id_fields = ['vendor']


@admin.register(VendorSettings)
class VendorSettingsAdmin(BaseModelAdmin):
    list_display = ['vendor', 'email_notifications', 'sms_notifications', 'min_order_amount', 'status_display', 'created_date']
    list_filter = ['email_notifications', 'sms_notifications', 'is_active', 'created_at']
    search_fields = ['vendor__business_name']
    raw_id_fields = ['vendor']