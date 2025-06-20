from django.db import models
from core.models import BaseModel

class Vendor(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    vendor = models.ForeignKey(Vendor, related_name='products', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class APIKey(BaseModel):
    """
    Model for managing API keys for third-party integrations.
    """
    name = models.CharField(
        max_length=100,
        help_text="Descriptive name for this API key"
    )
    key = models.CharField(
        max_length=255,
        unique=True,
        help_text="The actual API key"
    )
    service = models.CharField(
        max_length=50,
        choices=[
            ('payment', 'Payment Gateway'),
            ('shipping', 'Shipping Service'),
            ('sms', 'SMS Service'),
            ('email', 'Email Service'),
            ('analytics', 'Analytics Service'),
        ],
        help_text="Service this API key is for"
    )
    
    class Meta:
        verbose_name = "API Key"
        verbose_name_plural = "API Keys"
        
    def __str__(self):
        return f"{self.name} ({self.service})"


class SystemConfiguration(BaseModel):
    """
    Model for storing system-wide configuration settings.
    """
    key = models.CharField(
        max_length=100,
        unique=True,
        help_text="Configuration key name"
    )
    value = models.TextField(
        help_text="Configuration value"
    )
    description = models.TextField(
        blank=True,
        help_text="Description of what this configuration does"
    )
    
    class Meta:
        verbose_name = "System Configuration"
        verbose_name_plural = "System Configurations"
        
    def __str__(self):
        return f"{self.key}: {self.value[:50]}..."


class APIRequestLog(BaseModel):
    """
    Model for logging API requests for monitoring and debugging.
    """
    endpoint = models.CharField(
        max_length=255,
        help_text="API endpoint that was called"
    )
    method = models.CharField(
        max_length=10,
        choices=[
            ('GET', 'GET'),
            ('POST', 'POST'),
            ('PUT', 'PUT'),
            ('PATCH', 'PATCH'),
            ('DELETE', 'DELETE'),
        ]
    )
    status_code = models.IntegerField(
        help_text="HTTP status code returned"
    )
    response_time = models.FloatField(
        help_text="Response time in seconds"
    )
    user_agent = models.TextField(
        blank=True,
        help_text="User agent string"
    )
    ip_address = models.GenericIPAddressField(
        help_text="Client IP address"
    )
    
    class Meta:
        verbose_name = "API Request Log"
        verbose_name_plural = "API Request Logs"
        ordering = ['-created_at']
        
    def __str__(self):
        return f"{self.method} {self.endpoint} - {self.status_code}"