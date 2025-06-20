from django.contrib import admin
from django.utils.html import format_html
from core.admin import BaseModelAdmin
from .models import Category, Product, ProductImage, ProductReview, Collection


@admin.register(Collection)
class CollectionAdmin(admin.ModelAdmin):
    list_display = [
        'name',
        'vendor_business_name',
        'product_count_display',
        'available_product_count_display',
        'is_public',
        'created_at'
    ]
    list_filter = ['is_public', 'vendor', 'created_at', 'updated_at']
    search_fields = ['name', 'description', 'vendor__business_name']
    readonly_fields = ['id', 'created_at', 'updated_at', 'product_count_display']
    raw_id_fields = ['vendor']
    filter_horizontal = ['products']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('id', 'vendor', 'name', 'description')
        }),
        ('Settings', {
            'fields': ('is_public',)
        }),
        ('Products', {
            'fields': ('products',)
        }),
        ('Statistics', {
            'fields': ('product_count_display',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def vendor_business_name(self, obj):
        """Display vendor business name."""
        return obj.vendor.business_name if obj.vendor else "No Vendor"
    vendor_business_name.short_description = 'Vendor'

    def product_count_display(self, obj):
        """Display product count."""
        return obj.product_count
    product_count_display.short_description = 'Total Products'

    def available_product_count_display(self, obj):
        """Display available product count."""
        available_count = obj.available_product_count
        total_count = obj.product_count
        
        if available_count == total_count:
            color = "green"
        elif available_count > 0:
            color = "orange"
        else:
            color = "red"
        
        return format_html(
            '<span style="color: {};">{} / {}</span>',
            color, available_count, total_count
        )
    available_product_count_display.short_description = 'Available Products'

    def get_queryset(self, request):
        """Optimize queries by selecting related vendor."""
        return super().get_queryset(request).select_related('vendor')

    def formfield_for_manytomany(self, db_field, request, **kwargs):
        """Filter products to show only those from the selected vendor."""
        if db_field.name == "products":
            # This could be enhanced to filter by vendor when editing
            kwargs["queryset"] = Product.objects.select_related('vendor')
        return super().formfield_for_manytomany(db_field, request, **kwargs)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = [
        'name', 
        'vendor_business_name', 
        'price', 
        'quantity', 
        'stock_status_display',
        'is_available', 
        'collection_count_display',
        'created_at'
    ]
    list_filter = ['is_available', 'vendor', 'created_at', 'updated_at']
    search_fields = ['name', 'description', 'vendor__business_name']
    readonly_fields = ['id', 'created_at', 'updated_at', 'stock_status_display', 'collection_count_display']
    raw_id_fields = ['vendor']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('id', 'vendor', 'name', 'description')
        }),
        ('Pricing & Inventory', {
            'fields': ('price', 'quantity', 'is_available')
        }),
        ('Media', {
            'fields': ('image_url',)
        }),
        ('Statistics', {
            'fields': ('stock_status_display', 'collection_count_display'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def vendor_business_name(self, obj):
        """Display vendor business name."""
        return obj.vendor.business_name if obj.vendor else "No Vendor"
    vendor_business_name.short_description = 'Vendor'

    def stock_status_display(self, obj):
        """Display stock status with color coding."""
        status = obj.stock_status
        if status == "In Stock":
            color = "green"
        elif status == "Low Stock":
            color = "orange"
        elif status == "Out of Stock":
            color = "red"
        else:
            color = "gray"
        
        return format_html(
            '<span style="color: {};">● {}</span>',
            color, status
        )
    stock_status_display.short_description = 'Stock Status'

    def collection_count_display(self, obj):
        """Display number of collections this product belongs to."""
        count = obj.collections.count()
        return f"{count} collection{'s' if count != 1 else ''}"
    collection_count_display.short_description = 'Collections'

    def get_queryset(self, request):
        """Optimize queries by selecting related vendor."""
        return super().get_queryset(request).select_related('vendor')


@admin.register(Category)
class CategoryAdmin(BaseModelAdmin):
    list_display = ['name', 'parent', 'status_display', 'created_date']
    list_filter = ['parent', 'is_active', 'created_at']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ['image', 'alt_text', 'is_primary', 'order']


@admin.register(ProductImage)
class ProductImageAdmin(BaseModelAdmin):
    list_display = ['product', 'alt_text', 'is_primary', 'order', 'status_display', 'created_date']
    list_filter = ['is_primary', 'is_active', 'created_at']
    search_fields = ['product__name', 'alt_text']


@admin.register(ProductReview)
class ProductReviewAdmin(BaseModelAdmin):
    list_display = ['product', 'customer_name', 'rating', 'is_verified', 'status_display', 'created_date']
    list_filter = ['rating', 'is_verified', 'is_active', 'created_at']
    search_fields = ['product__name', 'customer_name', 'customer_email', 'title']
    readonly_fields = ['created_at', 'updated_at']