from django.urls import path
from . import views
from products.views import PublicVendorCollectionsView, PublicCollectionDetailView

app_name = 'vendors'

urlpatterns = [
    # Authenticated Vendor Profile endpoint (new)
    path('profile/', views.VendorProfileView.as_view(), name='vendor_profile'),
    
    # Vendor Profile CRUD endpoints
    path('profiles/', views.VendorProfileListCreateView.as_view(), name='vendor_profile_list_create'),
    path('profiles/<slug:slug>/', views.VendorProfileDetailView.as_view(), name='vendor_profile_detail'),
    
    # Public vendor collection endpoints (no authentication required)
    path('<slug:vendor_slug>/collections/', PublicVendorCollectionsView.as_view(), name='public_vendor_collections'),
    path('<slug:vendor_slug>/collections/<uuid:collection_id>/', PublicCollectionDetailView.as_view(), name='public_collection_detail'),
    
    # Existing Vendor endpoints
    path('', views.VendorListView.as_view(), name='vendor_list'),
    path('verified/', views.VerifiedVendorsView.as_view(), name='verified_vendors'),
    path('<slug:slug>/', views.VendorDetailView.as_view(), name='vendor_detail'),
]