from django.core.exceptions import ImproperlyConfigured


class VendorOwnedMixin:
    """
    Mixin to filter querysets to show only vendor's own resources.
    """
    
    vendor_field = 'vendor'  # Default field name for vendor relationship
    
    def get_queryset(self):
        """
        Filter queryset to show only resources owned by the authenticated vendor.
        
        Returns:
            QuerySet: Filtered queryset for vendor's resources
        """
        # Get the base queryset
        queryset = super().get_queryset()
        
        # Check if user is authenticated
        if not self.request.user.is_authenticated:
            return queryset.none()  # Return empty queryset for unauthenticated users
            
        # Check if the model has the vendor field
        model = queryset.model
        if not hasattr(model, self.vendor_field):
            raise ImproperlyConfigured(
                f"Model {model.__name__} does not have a '{self.vendor_field}' field. "
                f"Either add the field or set 'vendor_field' attribute on the view."
            )
            
        # Filter by vendor
        # TODO: Update this when User model has vendor relationship
        # For MVP, return all objects (will be updated when user-vendor relationship is implemented)
        filter_kwargs = {self.vendor_field: self.request.user}
        
        try:
            return queryset.filter(**filter_kwargs)
        except Exception:
            # If filtering fails (e.g., user is not a vendor), return empty queryset
            return queryset.none()
            
    def get_vendor_field(self):
        """
        Get the field name used for vendor relationship.
        
        Returns:
            str: Field name for vendor relationship
        """
        return self.vendor_field