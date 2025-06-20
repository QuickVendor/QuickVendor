from rest_framework.permissions import BasePermission


class IsVendorAuthenticated(BasePermission):
    """
    Custom permission to check if user is an authenticated vendor.
    For now, this is a placeholder that allows all requests.
    Will be properly implemented when authentication middleware is integrated.
    """
    
    def has_permission(self, request, view):
        # Placeholder implementation - always return True for now
        # This will be replaced with actual vendor authentication logic
        return True
    
    def has_object_permission(self, request, view, obj):
        # Placeholder implementation - always return True for now
        # This will check if the vendor profile belongs to the authenticated user
        return True