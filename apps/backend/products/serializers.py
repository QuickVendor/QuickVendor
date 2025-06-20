from rest_framework import serializers
from .models import Product, Category, ProductImage, ProductReview, Collection


class ProductSerializer(serializers.ModelSerializer):
    """
    Main Product serializer for CRUD operations.
    Excludes vendor (will be set automatically).
    """
    
    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'description',
            'price',
            'quantity',
            'image_url',
            'is_available'
        ]
        read_only_fields = ['id']

    def validate_price(self, value):
        """
        Validate that price is greater than 0.
        """
        if value <= 0:
            raise serializers.ValidationError("Price must be greater than 0.")
        return value

    def validate_name(self, value):
        """
        Validate product name.
        - Required
        - Min length 3
        """
        if not value or not value.strip():
            raise serializers.ValidationError("Product name is required.")
        
        value = value.strip()
        
        if len(value) < 3:
            raise serializers.ValidationError("Product name must be at least 3 characters long.")
        
        return value

    def validate_quantity(self, value):
        """
        Validate quantity is non-negative.
        """
        if value < 0:
            raise serializers.ValidationError("Quantity cannot be negative.")
        return value


class ProductListSerializer(serializers.ModelSerializer):
    """
    Simplified Product serializer for listings and collections.
    Includes only essential fields for public display.
    """
    
    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'price',
            'image_url',
            'is_available'
        ]
        read_only_fields = ['id']


class CollectionSerializer(serializers.ModelSerializer):
    """
    Collection serializer for CRUD operations.
    Includes product_count as computed field.
    Excludes products field for now.
    """
    product_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Collection
        fields = [
            'id',
            'name',
            'description',
            'is_public',
            'product_count'
        ]
        read_only_fields = ['id']

    def get_product_count(self, obj):
        """
        Return the number of products in this collection.
        """
        return obj.product_count

    def validate_name(self, value):
        """
        Validate collection name.
        - Required
        - Min length 2
        """
        if not value or not value.strip():
            raise serializers.ValidationError("Collection name is required.")
        
        value = value.strip()
        
        if len(value) < 2:
            raise serializers.ValidationError("Collection name must be at least 2 characters long.")
        
        return value


class CollectionDetailSerializer(serializers.ModelSerializer):
    """
    Detailed Collection serializer for public collection views.
    Includes available products in the collection using ProductListSerializer.
    """
    products = serializers.SerializerMethodField()
    available_product_count = serializers.SerializerMethodField()
    vendor = serializers.SerializerMethodField()
    
    class Meta:
        model = Collection
        fields = [
            'id',
            'name',
            'description',
            'available_product_count',
            'vendor',
            'products'
        ]
        read_only_fields = ['id']

    def get_products(self, obj):
        """
        Return only available products in this collection.
        """
        available_products = obj.get_available_products()
        return ProductListSerializer(available_products, many=True).data

    def get_available_product_count(self, obj):
        """
        Return the number of available products in this collection.
        """
        return obj.available_product_count

    def get_vendor(self, obj):
        """
        Return vendor information for the collection.
        """
        return {
            'slug': obj.vendor.slug,
            'business_name': obj.vendor.business_name
        }


# Keep existing serializers for backward compatibility
class CategorySerializer(serializers.ModelSerializer):
    """
    Serializer for Category model.
    """
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'image']


class ProductImageSerializer(serializers.ModelSerializer):
    """
    Serializer for ProductImage model.
    """
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'is_primary', 'order']


class ProductReviewSerializer(serializers.ModelSerializer):
    """
    Serializer for ProductReview model.
    """
    class Meta:
        model = ProductReview
        fields = [
            'id', 'customer_name', 'rating', 'title', 
            'comment', 'is_verified', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

    def validate_rating(self, value):
        """Validate rating is between 1 and 5."""
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value

    def validate_customer_name(self, value):
        """Validate customer name."""
        if not value or not value.strip():
            raise serializers.ValidationError("Customer name is required.")
        return value.strip()


# Additional utility serializers for specific use cases
class ProductBasicSerializer(serializers.ModelSerializer):
    """
    Very basic Product serializer with just id and name.
    Useful for dropdown lists and references.
    """
    class Meta:
        model = Product
        fields = ['id', 'name']


class CollectionBasicSerializer(serializers.ModelSerializer):
    """
    Basic Collection serializer with just id and name.
    Useful for dropdown lists and references.
    """
    class Meta:
        model = Collection
        fields = ['id', 'name', 'product_count']
    
    product_count = serializers.SerializerMethodField()

    def get_product_count(self, obj):
        return obj.product_count