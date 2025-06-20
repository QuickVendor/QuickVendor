from django.urls import path
from . import views

app_name = 'products'

urlpatterns = [
    # Vendor Product CRUD endpoints (authenticated)
    path('', views.ProductListCreateView.as_view(), name='product_list_create'),
    path('<uuid:pk>/', views.ProductDetailView.as_view(), name='product_detail'),
    
    # Public vendor product endpoints (no authentication required)
    path('public/<slug:vendor_slug>/', views.PublicVendorProductsView.as_view(), name='public_vendor_products'),
    path('public/<slug:vendor_slug>/<uuid:pk>/', views.PublicProductDetailView.as_view(), name='public_product_detail'),
    
    # Collection endpoints (public)
    path('collections/', views.CollectionListView.as_view(), name='collection_list'),
    path('collections/<uuid:id>/', views.CollectionDetailView.as_view(), name='collection_detail'),
    
    # Category endpoints (public)
    path('categories/', views.CategoryListView.as_view(), name='category_list'),
    
    # Review endpoints (public)
    path('<uuid:product_id>/reviews/', views.ProductReviewListView.as_view(), name='product_reviews'),
    
    # Featured products (public)
    path('featured/', views.FeaturedProductsView.as_view(), name='featured_products'),
]