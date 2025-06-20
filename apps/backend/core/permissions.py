import uuid
from rest_framework.permissions import BasePermission


class IsVendorAuthenticated(BasePermission):
    """
    Custom permission to check if user is an authenticated vendor.
    For now, this extracts vendor ID from headers for testing.
    Will be properly implemented when authentication middleware is integrated.
    """
    
    def has_permission(self, request, view):
        """
        Check if vendor user ID is provided and valid.
        
        Args:
            request: HTTP request object
            view: View being accessed
            
        Returns:
            bool: True if vendor is authenticated, False otherwise
        """
        # Extract vendor user ID from request
        vendor_user_id = self.get_vendor_user_id(request)
        if not vendor_user_id:
            return False
        
        # Store vendor_user_id in request for use in views
        request.vendor_user_id = vendor_user_id
        return True
    
    def has_object_permission(self, request, view, obj):
        """
        Object-level permission to check if user can access specific object.
        
        Args:
            request: HTTP request object
            view: View being accessed
            obj: Object being accessed
            
        Returns:
            bool: True if user can access object, False otherwise
        """
        # Check if the object belongs to the authenticated vendor
        vendor_user_id = getattr(request, 'vendor_user_id', None)
        if not vendor_user_id:
            return False
        
        # For Product objects, check if vendor matches
        if hasattr(obj, 'vendor'):
            return str(obj.vendor.user_id) == str(vendor_user_id)
        
        return False
    
    def get_vendor_user_id(self, request):
        """
        Extract vendor user_id from request.
        This is a placeholder implementation for testing.
        In production, this will extract the user_id from JWT token.
        
        Args:
            request: HTTP request object
            
        Returns:
            UUID or None: Vendor user ID if valid, None otherwise
        """
        # Try to get from header first, then query param
        user_id = request.headers.get('X-Vendor-User-ID') or request.GET.get('vendor_user_id')
        
        if not user_id:
            return None
        
        try:
            return uuid.UUID(user_id)
        except (ValueError, TypeError):
            return None