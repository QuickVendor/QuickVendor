import uuid
from rest_framework import generics, filters, status
from rest_framework.response import Response
from rest_framework.exceptions import NotFound, PermissionDenied
from django_filters.rest_framework import DjangoFilterBackend
from django.db import transaction
from django.core.exceptions import ValidationError
from .models import Product, Category, ProductReview, Collection
from .serializers import (
    ProductSerializer, CategorySerializer, ProductReviewSerializer,
    CollectionSerializer, ProductListSerializer, CollectionDetailSerializer
)
from core.permissions import IsVendorAuthenticated
from vendors.models import VendorProfile


class ProductListCreateView(generics.ListCreateAPIView):
    """
    List vendor's products with pagination and create new products.
    GET: List all products for authenticated vendor
    POST: Create new product for authenticated vendor
    """
    serializer_class = ProductSerializer
    permission_classes = [IsVendorAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_available', 'quantity']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'price', 'created_at', 'quantity']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """
        Return products for the authenticated vendor only.
        """
        vendor_user_id = getattr(self.request, 'vendor_user_id', None)
        if not vendor_user_id:
            return Product.objects.none()
        
        try:
            return Product.objects.filter(
                vendor__user_id=vendor_user_id
            ).select_related('vendor')
        except Exception:
            return Product.objects.none()
    
    def create(self, request, *args, **kwargs):
        """
        Create a new product for the authenticated vendor.
        """
        try:
            # Get vendor user ID from request
            vendor_user_id = getattr(request, 'vendor_user_id', None)
            if not vendor_user_id:
                return Response(
                    {
                        'error': 'Authentication required',
                        'message': 'Vendor user ID not found in request'
                    },
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            # Get vendor profile
            try:
                vendor_profile = VendorProfile.objects.get(
                    user_id=vendor_user_id,
                    is_active=True
                )
            except VendorProfile.DoesNotExist:
                return Response(
                    {
                        'error': 'Vendor not found',
                        'message': 'Vendor profile does not exist or is inactive'
                    },
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Validate request data
            serializer = self.get_serializer(data=request.data)
            if not serializer.is_valid():
                return Response(
                    {
                        'error': 'Validation failed',
                        'message': 'Invalid data provided',
                        'details': serializer.errors
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Save product with vendor
            try:
                with transaction.atomic():
                    product = serializer.save(vendor=vendor_profile)
                
                return Response(
                    {
                        'success': True,
                        'message': 'Product created successfully',
                        'data': ProductSerializer(product).data
                    },
                    status=status.HTTP_201_CREATED
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
                    'message': 'An unexpected error occurred while creating product'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def list(self, request, *args, **kwargs):
        """
        List products for authenticated vendor with proper error handling.
        """
        try:
            return super().list(request, *args, **kwargs)
        except Exception as e:
            return Response(
                {
                    'error': 'Internal server error',
                    'message': 'An unexpected error occurred while retrieving products'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or delete a specific product.
    GET/PUT/DELETE: Operations on specific product
    Vendor can only access their own products.
    """
    serializer_class = ProductSerializer
    permission_classes = [IsVendorAuthenticated]
    lookup_field = 'pk'
    
    def get_queryset(self):
        """
        Return products for the authenticated vendor only.
        """
        vendor_user_id = getattr(self.request, 'vendor_user_id', None)
        if not vendor_user_id:
            return Product.objects.none()
        
        return Product.objects.filter(
            vendor__user_id=vendor_user_id
        ).select_related('vendor')
    
    def get_object(self):
        """
        Get product object with proper error handling.
        """
        try:
            product = super().get_object()
            
            # Double-check vendor ownership
            vendor_user_id = getattr(self.request, 'vendor_user_id', None)
            if not vendor_user_id or str(product.vendor.user_id) != str(vendor_user_id):
                raise PermissionDenied("You don't have permission to access this product")
            
            return product
            
        except Product.DoesNotExist:
            raise NotFound("Product not found")
    
    def retrieve(self, request, *args, **kwargs):
        """
        Retrieve a specific product with error handling.
        """
        try:
            return super().retrieve(request, *args, **kwargs)
        except NotFound:
            return Response(
                {
                    'error': 'Product not found',
                    'message': 'The requested product does not exist or you do not have access to it'
                },
                status=status.HTTP_404_NOT_FOUND
            )
        except PermissionDenied as e:
            return Response(
                {
                    'error': 'Permission denied',
                    'message': str(e)
                },
                status=status.HTTP_403_FORBIDDEN
            )
        except Exception as e:
            return Response(
                {
                    'error': 'Internal server error',
                    'message': 'An unexpected error occurred while retrieving product'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def update(self, request, *args, **kwargs):
        """
        Update a specific product with error handling.
        """
        try:
            # Get the product first to ensure permissions
            product = self.get_object()
            
            # Validate request data
            serializer = self.get_serializer(product, data=request.data, partial=kwargs.get('partial', False))
            if not serializer.is_valid():
                return Response(
                    {
                        'error': 'Validation failed',
                        'message': 'Invalid data provided',
                        'details': serializer.errors
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Save updated product
            try:
                with transaction.atomic():
                    updated_product = serializer.save()
                
                return Response(
                    {
                        'success': True,
                        'message': 'Product updated successfully',
                        'data': ProductSerializer(updated_product).data
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
            
        except NotFound:
            return Response(
                {
                    'error': 'Product not found',
                    'message': 'The requested product does not exist or you do not have access to it'
                },
                status=status.HTTP_404_NOT_FOUND
            )
        except PermissionDenied as e:
            return Response(
                {
                    'error': 'Permission denied',
                    'message': str(e)
                },
                status=status.HTTP_403_FORBIDDEN
            )
        except Exception as e:
            return Response(
                {
                    'error': 'Internal server error',
                    'message': 'An unexpected error occurred while updating product'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def destroy(self, request, *args, **kwargs):
        """
        Delete a specific product with error handling.
        """
        try:
            product = self.get_object()
            
            # Store product name for response
            product_name = product.name
            
            # Delete the product
            with transaction.atomic():
                product.delete()
            
            return Response(
                {
                    'success': True,
                    'message': f'Product "{product_name}" deleted successfully'
                },
                status=status.HTTP_204_NO_CONTENT
            )
            
        except NotFound:
            return Response(
                {
                    'error': 'Product not found',
                    'message': 'The requested product does not exist or you do not have access to it'
                },
                status=status.HTTP_404_NOT_FOUND
            )
        except PermissionDenied as e:
            return Response(
                {
                    'error': 'Permission denied',
                    'message': str(e)
                },
                status=status.HTTP_403_FORBIDDEN
            )
        except Exception as e:
            return Response(
                {
                    'error': 'Internal server error',
                    'message': 'An unexpected error occurred while deleting product'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# Public views (no authentication required)
class CollectionListView(generics.ListAPIView):
    """
    List all public collections with filtering and search.
    """
    queryset = Collection.objects.filter(is_public=True).select_related('vendor')
    serializer_class = CollectionSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['vendor', 'is_public']
    search_fields = ['name', 'description', 'vendor__business_name']
    ordering_fields = ['name', 'created_at']
    ordering = ['-created_at']


class CollectionDetailView(generics.RetrieveAPIView):
    """
    Retrieve a single collection by ID with product details.
    """
    queryset = Collection.objects.filter(is_public=True).select_related('vendor').prefetch_related('products')
    serializer_class = CollectionSerializer
    lookup_field = 'id'


class CategoryListView(generics.ListAPIView):
    """
    List all active categories.
    """
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']


class ProductReviewListView(generics.ListAPIView):
    """
    List reviews for a specific product.
    """
    serializer_class = ProductReviewSerializer
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['rating', 'created_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        product_id = self.kwargs['product_id']
        return ProductReview.objects.filter(
            product_id=product_id,
            is_active=True
        )


class FeaturedProductsView(generics.ListAPIView):
    """
    List products that are in stock and available.
    This can be extended later to include actual featured products logic.
    """
    queryset = Product.objects.filter(
        is_available=True, 
        quantity__gt=0
    ).select_related('vendor').order_by('-created_at')[:20]
    serializer_class = ProductSerializer
    ordering = ['-created_at']


# Public product views (no authentication required)
class PublicVendorProductsView(generics.ListAPIView):
    """
    Public view to list all available products for a specific vendor.
    Accessible without authentication for customers to browse products.
    """
    serializer_class = ProductListSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'price', 'created_at']
    ordering = ['-created_at']
    pagination_class = None  # Will set custom pagination
    
    def get_queryset(self):
        """
        Return available products for the specified vendor slug.
        """
        vendor_slug = self.kwargs.get('vendor_slug')
        
        try:
            # Get vendor by slug
            vendor = VendorProfile.objects.get(
                slug=vendor_slug,
                is_active=True
            )
            
            # Return available products for this vendor
            return Product.objects.filter(
                vendor=vendor,
                is_available=True
            ).select_related('vendor')
            
        except VendorProfile.DoesNotExist:
            # Return empty queryset for invalid vendor slug
            return Product.objects.none()
    
    def list(self, request, *args, **kwargs):
        """
        List products with proper error handling for invalid vendor.
        """
        vendor_slug = kwargs.get('vendor_slug')
        
        try:
            # Check if vendor exists first
            vendor = VendorProfile.objects.get(
                slug=vendor_slug,
                is_active=True
            )
        except VendorProfile.DoesNotExist:
            return Response(
                {
                    'error': 'Vendor not found',
                    'message': f'No active vendor found with slug: {vendor_slug}'
                },
                status=status.HTTP_404_NOT_FOUND
            )
        
        try:
            # Get the queryset and paginate manually for 10 items per page
            queryset = self.filter_queryset(self.get_queryset())
            
            # Manual pagination - 10 products per page
            page_size = 10
            page_param = request.query_params.get('page', 1)
            
            try:
                page = int(page_param)
                if page < 1:
                    page = 1
            except (ValueError, TypeError):
                page = 1
            
            start_index = (page - 1) * page_size
            end_index = start_index + page_size
            
            total_count = queryset.count()
            paginated_queryset = queryset[start_index:end_index]
            
            # Calculate pagination info
            has_next = end_index < total_count
            has_previous = page > 1
            next_page = page + 1 if has_next else None
            previous_page = page - 1 if has_previous else None
            
            # Serialize the data
            serializer = self.get_serializer(paginated_queryset, many=True)
            
            return Response({
                'count': total_count,
                'page': page,
                'page_size': page_size,
                'next': next_page,
                'previous': previous_page,
                'vendor': {
                    'slug': vendor.slug,
                    'business_name': vendor.business_name
                },
                'results': serializer.data
            })
            
        except Exception as e:
            return Response(
                {
                    'error': 'Internal server error',
                    'message': 'An unexpected error occurred while retrieving products'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class PublicProductDetailView(generics.RetrieveAPIView):
    """
    Public view to retrieve a single product for a specific vendor.
    Accessible without authentication for customers to view product details.
    """
    serializer_class = ProductSerializer
    lookup_field = 'pk'
    
    def get_queryset(self):
        """
        Return available products for the specified vendor slug.
        """
        vendor_slug = self.kwargs.get('vendor_slug')
        
        try:
            vendor = VendorProfile.objects.get(
                slug=vendor_slug,
                is_active=True
            )
            
            return Product.objects.filter(
                vendor=vendor,
                is_available=True
            ).select_related('vendor')
            
        except VendorProfile.DoesNotExist:
            return Product.objects.none()
    
    def retrieve(self, request, *args, **kwargs):
        """
        Retrieve product with proper error handling.
        """
        vendor_slug = kwargs.get('vendor_slug')
        product_id = kwargs.get('pk')
        
        try:
            # Check if vendor exists
            try:
                vendor = VendorProfile.objects.get(
                    slug=vendor_slug,
                    is_active=True
                )
            except VendorProfile.DoesNotExist:
                return Response(
                    {
                        'error': 'Vendor not found',
                        'message': f'No active vendor found with slug: {vendor_slug}'
                    },
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Check if product exists and belongs to vendor
            try:
                product = Product.objects.select_related('vendor').get(
                    id=product_id,
                    vendor=vendor,
                    is_available=True
                )
            except Product.DoesNotExist:
                return Response(
                    {
                        'error': 'Product not found',
                        'message': f'No available product found with ID {product_id} for vendor {vendor_slug}'
                    },
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Serialize and return product data
            serializer = self.get_serializer(product)
            
            # Add vendor information to response
            response_data = serializer.data.copy()
            response_data['vendor'] = {
                'slug': vendor.slug,
                'business_name': vendor.business_name,
                'whatsapp': vendor.whatsapp
            }
            
            return Response(response_data)
            
        except Exception as e:
            return Response(
                {
                    'error': 'Internal server error',
                    'message': 'An unexpected error occurred while retrieving product'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class PublicVendorCollectionsView(generics.ListAPIView):
    """
    Public view to list collections for a specific vendor.
    Accessible without authentication for customers to browse vendor collections.
    """
    serializer_class = CollectionSerializer
    pagination_class = None  # No pagination for collections list
    
    def get_queryset(self):
        """
        Return public collections for the specified vendor slug.
        """
        vendor_slug = self.kwargs.get('vendor_slug')
        
        try:
            # Get vendor by slug
            vendor = VendorProfile.objects.get(
                slug=vendor_slug,
                is_active=True
            )
            
            # Return public collections for this vendor
            return Collection.objects.filter(
                vendor=vendor,
                is_public=True
            ).select_related('vendor')
            
        except VendorProfile.DoesNotExist:
            # Return empty queryset for invalid vendor slug
            return Collection.objects.none()
    
    def list(self, request, *args, **kwargs):
        """
        List collections with proper error handling for invalid vendor.
        """
        vendor_slug = kwargs.get('vendor_slug')
        
        try:
            # Check if vendor exists first
            vendor = VendorProfile.objects.get(
                slug=vendor_slug,
                is_active=True
            )
        except VendorProfile.DoesNotExist:
            return Response(
                {
                    'error': 'Vendor not found',
                    'message': f'No active vendor found with slug: {vendor_slug}'
                },
                status=status.HTTP_404_NOT_FOUND
            )
        
        try:
            # Get the collections
            queryset = self.filter_queryset(self.get_queryset())
            serializer = self.get_serializer(queryset, many=True)
            
            return Response({
                'vendor': {
                    'slug': vendor.slug,
                    'business_name': vendor.business_name
                },
                'count': queryset.count(),
                'collections': serializer.data
            })
            
        except Exception as e:
            return Response(
                {
                    'error': 'Internal server error',
                    'message': 'An unexpected error occurred while retrieving collections'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class PublicCollectionDetailView(generics.RetrieveAPIView):
    """
    Public view to retrieve a single collection with its products for a specific vendor.
    Accessible without authentication for customers to view collection details.
    """
    serializer_class = CollectionDetailSerializer
    lookup_field = 'collection_id'
    lookup_url_kwarg = 'collection_id'
    
    def get_queryset(self):
        """
        Return public collections for the specified vendor slug.
        """
        vendor_slug = self.kwargs.get('vendor_slug')
        
        try:
            vendor = VendorProfile.objects.get(
                slug=vendor_slug,
                is_active=True
            )
            
            return Collection.objects.filter(
                vendor=vendor,
                is_public=True
            ).select_related('vendor').prefetch_related(
                'products__vendor'
            )
            
        except VendorProfile.DoesNotExist:
            return Collection.objects.none()
    
    def retrieve(self, request, *args, **kwargs):
        """
        Retrieve collection with proper error handling.
        """
        vendor_slug = kwargs.get('vendor_slug')
        collection_id = kwargs.get('collection_id')
        
        try:
            # Check if vendor exists
            try:
                vendor = VendorProfile.objects.get(
                    slug=vendor_slug,
                    is_active=True
                )
            except VendorProfile.DoesNotExist:
                return Response(
                    {
                        'error': 'Vendor not found',
                        'message': f'No active vendor found with slug: {vendor_slug}'
                    },
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Check if collection exists and belongs to vendor
            try:
                collection = Collection.objects.select_related('vendor').prefetch_related(
                    'products__vendor'
                ).get(
                    id=collection_id,
                    vendor=vendor,
                    is_public=True
                )
            except Collection.DoesNotExist:
                return Response(
                    {
                        'error': 'Collection not found',
                        'message': f'No public collection found with ID {collection_id} for vendor {vendor_slug}'
                    },
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Serialize and return collection data
            serializer = self.get_serializer(collection)
            return Response(serializer.data)
            
        except Exception as e:
            return Response(
                {
                    'error': 'Internal server error',
                    'message': 'An unexpected error occurred while retrieving collection'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )