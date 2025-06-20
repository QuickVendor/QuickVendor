import uuid
from django.db import models
from django.core.validators import RegexValidator
from django.utils.text import slugify
from core.models import BaseModel, TimeStampedModel


class VendorProfile(TimeStampedModel):
    """
    Vendor profile model that stores vendor information linked to Supabase user ID.
    """
    user_id = models.UUIDField(
        primary_key=True,
        help_text="Supabase user ID"
    )
    business_name = models.CharField(
        max_length=100,
        blank=False,
        help_text="Official business name"
    )
    slug = models.SlugField(
        max_length=100,
        unique=True,
        blank=True,
        help_text="URL-friendly version of business name"
    )
    whatsapp = models.CharField(
        max_length=20,
        blank=True,
        help_text="WhatsApp contact number"
    )
    bank_name = models.CharField(
        max_length=100,
        blank=True,
        help_text="Bank name for payments"
    )
    account_number = models.CharField(
        max_length=20,
        blank=True,
        help_text="Bank account number"
    )
    account_name = models.CharField(
        max_length=100,
        blank=True,
        help_text="Account holder name"
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Whether vendor profile is active"
    )

    class Meta:
        verbose_name = "Vendor Profile"
        verbose_name_plural = "Vendor Profiles"
        ordering = ['business_name']

    def __str__(self):
        """Return business name as string representation."""
        return self.business_name

    def save(self, *args, **kwargs):
        """
        Override save method to auto-generate slug from business_name if empty.
        Handle duplicate slugs by appending numbers.
        """
        if not self.slug and self.business_name:
            # Generate base slug from business name
            base_slug = slugify(self.business_name)
            slug = base_slug
            counter = 1
            
            # Check for existing slugs and append numbers if needed
            while VendorProfile.objects.filter(slug=slug).exclude(user_id=self.user_id).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            
            self.slug = slug
        
        super().save(*args, **kwargs)


class Vendor(BaseModel):
    """
    Vendor/seller profiles for the marketplace.
    """
    business_name = models.CharField(
        max_length=200,
        help_text="Official business name"
    )
    slug = models.SlugField(
        max_length=200,
        unique=True,
        help_text="URL-friendly store name"
    )
    description = models.TextField(
        help_text="Vendor description"
    )
    logo = models.ImageField(
        upload_to='vendors/logos/',
        blank=True,
        null=True,
        help_text="Vendor logo"
    )
    banner = models.ImageField(
        upload_to='vendors/banners/',
        blank=True,
        null=True,
        help_text="Store banner image"
    )
    
    # Contact Information
    email = models.EmailField(
        help_text="Business email address"
    )
    phone = models.CharField(
        max_length=20,
        validators=[
            RegexValidator(
                regex=r'^\+?1?\d{9,15}$',
                message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
            )
        ],
        help_text="Business phone number"
    )
    website = models.URLField(
        blank=True,
        help_text="Business website URL"
    )
    
    # Business Address
    address_line_1 = models.CharField(
        max_length=255,
        help_text="Street address"
    )
    address_line_2 = models.CharField(
        max_length=255,
        blank=True,
        help_text="Apartment, suite, etc."
    )
    city = models.CharField(
        max_length=100,
        help_text="City"
    )
    state = models.CharField(
        max_length=100,
        help_text="State/Province"
    )
    postal_code = models.CharField(
        max_length=20,
        help_text="Postal/ZIP code"
    )
    country = models.CharField(
        max_length=100,
        default="Nigeria",
        help_text="Country"
    )
    
    # Business Details
    tax_id = models.CharField(
        max_length=50,
        blank=True,
        help_text="Tax identification number"
    )
    registration_number = models.CharField(
        max_length=100,
        blank=True,
        help_text="Business registration number"
    )
    
    # Status
    is_verified = models.BooleanField(
        default=False,
        help_text="Whether vendor is verified"
    )
    is_approved = models.BooleanField(
        default=False,
        help_text="Whether vendor is approved to sell"
    )
    
    class Meta:
        verbose_name = "Vendor"
        verbose_name_plural = "Vendors"
        ordering = ['business_name']
        
    def __str__(self):
        return self.business_name
    
    @property
    def full_address(self):
        """Get formatted full address."""
        address_parts = [
            self.address_line_1,
            self.address_line_2,
            self.city,
            self.state,
            self.postal_code,
            self.country
        ]
        return ", ".join([part for part in address_parts if part])


class VendorBankAccount(BaseModel):
    """
    Vendor bank account information for payments.
    """
    vendor = models.ForeignKey(
        Vendor,
        on_delete=models.CASCADE,
        related_name='bank_accounts',
        help_text="Vendor this account belongs to"
    )
    bank_name = models.CharField(
        max_length=100,
        help_text="Name of the bank"
    )
    account_name = models.CharField(
        max_length=200,
        help_text="Account holder name"
    )
    account_number = models.CharField(
        max_length=50,
        help_text="Bank account number"
    )
    routing_number = models.CharField(
        max_length=50,
        blank=True,
        help_text="Bank routing number (if applicable)"
    )
    is_primary = models.BooleanField(
        default=False,
        help_text="Primary account for payments"
    )
    is_verified = models.BooleanField(
        default=False,
        help_text="Whether account is verified"
    )
    
    class Meta:
        verbose_name = "Vendor Bank Account"
        verbose_name_plural = "Vendor Bank Accounts"
        
    def __str__(self):
        return f"{self.vendor.business_name} - {self.bank_name} ({self.account_number[-4:]})"


class VendorSettings(BaseModel):
    """
    Vendor-specific settings and preferences.
    """
    vendor = models.OneToOneField(
        Vendor,
        on_delete=models.CASCADE,
        related_name='settings',
        help_text="Vendor these settings belong to"
    )
    
    # Notification Settings
    email_notifications = models.BooleanField(
        default=True,
        help_text="Receive email notifications"
    )
    sms_notifications = models.BooleanField(
        default=False,
        help_text="Receive SMS notifications"
    )
    
    # Business Settings
    min_order_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0.00,
        help_text="Minimum order amount"
    )
    processing_time = models.PositiveIntegerField(
        default=1,
        help_text="Order processing time in days"
    )
    return_policy = models.TextField(
        blank=True,
        help_text="Return policy text"
    )
    
    class Meta:
        verbose_name = "Vendor Settings"
        verbose_name_plural = "Vendor Settings"
        
    def __str__(self):
        return f"{self.vendor.business_name} - Settings"