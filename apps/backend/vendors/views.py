import uuid
from rest_framework import generics, filters, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django.db import transaction
from django.core.exceptions import ValidationError
from .models import Vendor, VendorSettings, VendorProfile
from .serializers import VendorSerializer, VendorSettingsSerializer, VendorProfileSerializer
from .permissions import IsVendorAuthenticated


class VendorProfileView(APIView):
    """
    API view for authenticated vendor profile operations.
    GET: Return authenticated vendor's profile
    PUT: Update authenticated vendor's profile
    """
    permission_classes = [IsVendorAuthenticated]
    
    def get_vendor_user_id(self, request):
        """
        Extract vendor user_id from request.
        This is a placeholder implementation.
        In production, this will extract the user_id from JWT token or session.
        """
        # Placeholder: For testing, we'll use a header or query param
        # In production, this will be extracted from authenticated user token
        user_id = request.headers.get('X-Vendor-User-ID') or request.GET.get('user_id')
        
        if not user_id:
            return None
        
        try:
            return uuid.UUID(user_id)
        except (ValueError, TypeError):
            return None
    
    def get(self, request):
        """
        Return authenticated vendor's profile.
        """
        try:
            # Get vendor user_id
            vendor_user_id = self.get_vendor_user_id(request)
            if not vendor_user_id:
                return Response(
                    {
                        'error': 'Vendor authentication required',
                        'message': 'User ID not found in request'
                    },
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            # Try to get vendor profile
            try:
                vendor_profile = VendorProfile.objects.get(
                    user_id=vendor_user_id,
                    is_active=True
                )
            except VendorProfile.DoesNotExist:
                return Response(
                    {
                        'error': 'Profile not found',
                        'message': 'Vendor profile does not exist'
                    },
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Serialize and return profile
            serializer = VendorProfileSerializer(vendor_profile)
            return Response(
                {
                    'success': True,
                    'data': serializer.data
                },
                status=status.HTTP_200_OK
            )
            
        except Exception as e:
            return Response(
                {
                    'error': 'Internal server error',
                    'message': 'An unexpected error occurred while retrieving profile'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def put(self, request):
        """
        Update authenticated vendor's profile.
        """
        try:
            # Get vendor user_id
            vendor_user_id = self.get_vendor_user_id(request)
            if not vendor_user_id:
                return Response(
                    {
                        'error': 'Vendor authentication required',
                        'message': 'User ID not found in request'
                    },
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            # Try to get existing vendor profile
            try:
                vendor_profile = VendorProfile.objects.get(
                    user_id=vendor_user_id,
                    is_active=True
                )
            except VendorProfile.DoesNotExist:
                return Response(
                    {
                        'error': 'Profile not found',
                        'message': 'Vendor profile does not exist'
                    },
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Validate request data
            serializer = VendorProfileSerializer(
                vendor_profile, 
                data=request.data,
                partial=False  # Full update required for PUT
            )
            
            if not serializer.is_valid():
                return Response(
                    {
                        'error': 'Validation failed',
                        'message': 'Invalid data provided',
                        'details': serializer.errors
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Save updated profile within transaction
            try:
                with transaction.atomic():
                    updated_profile = serializer.save()
                
                return Response(
                    {
                        'success': True,
                        'message': 'Profile updated successfully',
                        'data': VendorProfileSerializer(updated_profile).data
                    },
                    status=status.HTTP_200_OK
                )
                
            except ValidationError as ve:
                return Response(
                    {
                        'error': 'Validation error',
                        'message': 'Data validation failed during save',
                        'details': str(ve)
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            
        except Exception as e:
            return Response(
                {
                    'error': 'Internal server error',
                    'message': 'An unexpected error occurred while updating profile'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class VendorProfileListCreateView(generics.ListCreateAPIView):
    """
    List all active vendor profiles or create a new one.
    """
    queryset = VendorProfile.objects.filter(is_active=True)
    serializer_class = VendorProfileSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['business_name', 'whatsapp']
    ordering_fields = ['business_name', 'created_at']
    ordering = ['business_name']
    
    def create(self, request, *args, **kwargs):
        """
        Override create to add proper error handling.
        """
        try:
            return super().create(request, *args, **kwargs)
        except Exception as e:
            return Response(
                {
                    'error': 'Creation failed',
                    'message': 'An error occurred while creating vendor profile'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class VendorProfileDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a vendor profile by slug.
    """
    queryset = VendorProfile.objects.filter(is_active=True)
    serializer_class = VendorProfileSerializer
    lookup_field = 'slug'

    def destroy(self, request, *args, **kwargs):
        """
        Soft delete by setting is_active to False.
        """
        try:
            instance = self.get_object()
            instance.is_active = False
            instance.save()
            return Response(
                {
                    'success': True,
                    'message': 'Profile deactivated successfully'
                },
                status=status.HTTP_204_NO_CONTENT
            )
        except Exception as e:
            return Response(
                {
                    'error': 'Deletion failed',
                    'message': 'An error occurred while deactivating profile'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class VendorListView(generics.ListAPIView):
    """
    List all active and approved vendors (existing functionality).
    """
    queryset = Vendor.objects.filter(is_active=True, is_approved=True)
    serializer_class = VendorSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['city', 'state', 'country', 'is_verified']
    search_fields = ['business_name', 'description', 'city']
    ordering_fields = ['business_name', 'created_at']
    ordering = ['business_name']


class VendorDetailView(generics.RetrieveAPIView):
    """
    Retrieve a single vendor by ID or slug (existing functionality).
    """
    queryset = Vendor.objects.filter(is_active=True, is_approved=True)
    serializer_class = VendorSerializer
    lookup_field = 'slug'


class VerifiedVendorsView(generics.ListAPIView):
    """
    List only verified vendors (existing functionality).
    """
    queryset = Vendor.objects.filter(
        is_active=True, 
        is_approved=True, 
        is_verified=True
    )
    serializer_class = VendorSerializer
    ordering = ['business_name']