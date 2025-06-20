import uuid
from django.db import models
from django.core.validators import MinValueValidator
from django.utils.text import slugify
from core.models import BaseModel, TimeStampedModel
from vendors.models import VendorProfile


class Product(TimeStampedModel):
    """
    Product model for vendor products in the marketplace.
    """
    id = models.UUIDField(
        primary_key=True, 
        default=uuid.uuid4, 
        editable=False,
        help_text="Unique product identifier"
    )
    vendor = models.ForeignKey(
        VendorProfile,
        on_delete=models.CASCADE,
        related_name='products',
        help_text="Vendor who owns this product"
    )
    name = models.CharField(
        max_length=200,
        blank=False,
        help_text="Product name"
    )
    description = models.TextField(
        blank=True,
        help_text="Product description"
    )
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=False,
        validators=[MinValueValidator(0.01)],
        help_text="Product price"
    )
    quantity = models.PositiveIntegerField(
        default=0,
        help_text="Available quantity in stock"
    )
    image_url = models.URLField(
        blank=True,
        null=True,
        help_text="Product image URL"
    )
    is_available = models.BooleanField(
        default=True,
        help_text="Whether product is available for purchase"
    )

    class Meta:
        verbose_name = "Product"
        verbose_name_plural = "Products"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['vendor', '-created_at']),
            models.Index(fields=['is_available', '-created_at']),
            models.Index(fields=['name']),
        ]

    def __str__(self):
        """Return product name as string representation."""
        return self.name

    @property
    def is_in_stock(self):
        """Check if product is in stock (quantity > 0)."""
        return self.quantity > 0

    def get_absolute_url(self):
        """Get the absolute URL for this product."""
        return f"/products/{self.id}/"

    @property
    def vendor_business_name(self):
        """Get vendor business name for easy access."""
        return self.vendor.business_name if self.vendor else "Unknown Vendor"

    @property
    def stock_status(self):
        """Get human-readable stock status."""
        if not self.is_available:
            return "Unavailable"
        elif self.quantity == 0:
            return "Out of Stock"
        elif self.quantity <= 5:
            return "Low Stock"
        else:
            return "In Stock"


class Collection(TimeStampedModel):
    """
    Collection model for grouping products together by vendors.
    """
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text="Unique collection identifier"
    )
    vendor = models.ForeignKey(
        VendorProfile,
        on_delete=models.CASCADE,
        related_name='collections',
        help_text="Vendor who owns this collection"
    )
    name = models.CharField(
        max_length=100,
        blank=False,
        help_text="Collection name"
    )
    description = models.TextField(
        blank=True,
        help_text="Collection description"
    )
    products = models.ManyToManyField(
        Product,
        blank=True,
        related_name='collections',
        help_text="Products in this collection"
    )
    is_public = models.BooleanField(
        default=True,
        help_text="Whether collection is publicly visible"
    )

    class Meta:
        verbose_name = "Collection"
        verbose_name_plural = "Collections"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['vendor', '-created_at']),
            models.Index(fields=['is_public', '-created_at']),
            models.Index(fields=['name']),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=['vendor', 'name'],
                name='unique_collection_name_per_vendor'
            )
        ]

    def __str__(self):
        """Return collection name as string representation."""
        return self.name

    @property
    def product_count(self):
        """Return the number of products in this collection."""
        return self.products.count()

    def get_available_products(self):
        """Return products in this collection that are available for purchase."""
        return self.products.filter(is_available=True)

    @property
    def available_product_count(self):
        """Return the number of available products in this collection."""
        return self.get_available_products().count()

    def get_absolute_url(self):
        """Get the absolute URL for this collection."""
        return f"/collections/{self.id}/"

    @property
    def vendor_business_name(self):
        """Get vendor business name for easy access."""
        return self.vendor.business_name if self.vendor else "Unknown Vendor"

    def add_product(self, product):
        """
        Add a product to this collection.
        Only allows products from the same vendor.
        """
        if product.vendor != self.vendor:
            raise ValueError("Cannot add product from different vendor to collection")
        self.products.add(product)

    def remove_product(self, product):
        """Remove a product from this collection."""
        self.products.remove(product)

    def add_products(self, products):
        """
        Add multiple products to this collection.
        Only allows products from the same vendor.
        """
        for product in products:
            if product.vendor != self.vendor:
                raise ValueError(f"Cannot add product '{product.name}' from different vendor to collection")
        self.products.add(*products)


# Keep existing models for backward compatibility
class Category(BaseModel):
    """
    Product categories for organizing products.
    """
    name = models.CharField(
        max_length=100,
        unique=True,
        help_text="Category name"
    )
    slug = models.SlugField(
        max_length=100,
        unique=True,
        help_text="URL-friendly category name"
    )
    description = models.TextField(
        blank=True,
        help_text="Category description"
    )
    image = models.ImageField(
        upload_to='categories/',
        blank=True,
        null=True,
        help_text="Category image"
    )
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name='children',
        help_text="Parent category (for subcategories)"
    )
    
    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"
        ordering = ['name']
        
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class ProductImage(BaseModel):
    """
    Multiple images for products.
    """
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='images',
        help_text="Product this image belongs to"
    )
    image = models.ImageField(
        upload_to='products/',
        help_text="Product image"
    )
    alt_text = models.CharField(
        max_length=200,
        blank=True,
        help_text="Alternative text for accessibility"
    )
    is_primary = models.BooleanField(
        default=False,
        help_text="Primary product image"
    )
    order = models.PositiveIntegerField(
        default=0,
        help_text="Display order"
    )
    
    class Meta:
        verbose_name = "Product Image"
        verbose_name_plural = "Product Images"
        ordering = ['order', 'created_at']
        
    def __str__(self):
        return f"{self.product.name} - Image {self.order}"


class ProductReview(BaseModel):
    """
    Customer reviews for products.
    """
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='reviews',
        help_text="Product being reviewed"
    )
    customer_name = models.CharField(
        max_length=100,
        help_text="Customer name"
    )
    customer_email = models.EmailField(
        help_text="Customer email"
    )
    rating = models.PositiveIntegerField(
        choices=[(i, i) for i in range(1, 6)],
        help_text="Rating from 1 to 5 stars"
    )
    title = models.CharField(
        max_length=200,
        help_text="Review title"
    )
    comment = models.TextField(
        help_text="Review comment"
    )
    is_verified = models.BooleanField(
        default=False,
        help_text="Whether review is verified"
    )
    
    class Meta:
        verbose_name = "Product Review"
        verbose_name_plural = "Product Reviews"
        ordering = ['-created_at']
        
    def __str__(self):
        return f"{self.product.name} - {self.rating} stars by {self.customer_name}"