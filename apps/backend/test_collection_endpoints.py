#!/usr/bin/env python
"""
Test script for the new public collection endpoints
"""
import os
import django
import requests
import json

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'quickvendor.settings')
django.setup()

from products.models import Product, Collection
from vendors.models import VendorProfile

BASE_URL = "http://localhost:8000"

def setup_test_data():
    """Create test data for collections"""
    print("🔧 Setting up test data...")
    
    # Get the test vendor
    vendor = VendorProfile.objects.first()
    if not vendor:
        print("❌ No vendor found in database")
        return None, None
    
    print(f"✅ Using vendor: {vendor.business_name} (slug: {vendor.slug})")
    
    # Create a test collection if it doesn't exist
    collection, created = Collection.objects.get_or_create(
        vendor=vendor,
        name='Electronics Collection',
        defaults={
            'description': 'Latest gadgets and electronic devices',
            'is_public': True
        }
    )
    
    if created:
        print(f"✅ Created collection: {collection.name}")
    else:
        print(f"✅ Using existing collection: {collection.name}")
    
    # Make sure we have products
    products = Product.objects.filter(vendor=vendor, is_available=True)
    if products.count() == 0:
        # Create a test product
        product = Product.objects.create(
            name="Test Smartphone",
            description="Latest Android smartphone with great features",
            price=299.99,
            quantity=25,
            is_available=True,
            vendor=vendor
        )
        print(f"✅ Created test product: {product.name}")
        products = [product]
    
    # Add products to collection
    for product in products[:3]:  # Add first 3 products
        collection.products.add(product)
    
    print(f"✅ Collection now has {collection.product_count} products")
    return vendor, collection

def test_collection_endpoints():
    print("🧪 Testing Public Collection Endpoints")
    print("=====================================")
    
    # Setup test data
    vendor, collection = setup_test_data()
    if not vendor:
        return
    
    # Test 1: List vendor collections
    print(f"\n🔍 Test 1: Public Vendor Collections List")
    url = f"{BASE_URL}/api/vendors/{vendor.slug}/collections/"
    print(f"GET {url}")
    
    try:
        response = requests.get(url, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success! Found {data.get('count', 0)} collections")
            print(f"   Vendor: {data.get('vendor', {}).get('business_name', 'N/A')}")
            
            if data.get('collections'):
                first_collection = data['collections'][0]
                collection_id = first_collection['id']
                print(f"   First Collection: {first_collection['name']} ({first_collection['product_count']} products)")
                
                # Test 2: Get collection details
                print(f"\n🔍 Test 2: Public Collection Detail")
                detail_url = f"{BASE_URL}/api/vendors/{vendor.slug}/collections/{collection_id}/"
                print(f"GET {detail_url}")
                
                detail_response = requests.get(detail_url, timeout=10)
                print(f"Status Code: {detail_response.status_code}")
                
                if detail_response.status_code == 200:
                    detail_data = detail_response.json()
                    print(f"✅ Success! Collection Details Retrieved")
                    print(f"   Name: {detail_data['name']}")
                    print(f"   Description: {detail_data.get('description', 'N/A')}")
                    print(f"   Available Products: {detail_data['available_product_count']}")
                    print(f"   Vendor: {detail_data.get('vendor', {}).get('business_name', 'N/A')}")
                    
                    # Show products in collection
                    products = detail_data.get('products', [])
                    if products:
                        print(f"   Products in collection:")
                        for product in products[:3]:  # Show first 3
                            print(f"     - {product['name']} (${product['price']})")
                    else:
                        print("   No products in collection")
                else:
                    print(f"❌ Collection detail failed: {detail_response.text}")
            else:
                print("⚠️  No collections in response")
        else:
            print(f"❌ Request failed: {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Connection error: {e}")
    
    # Test 3: Test with invalid vendor slug
    print(f"\n🔍 Test 3: Invalid Vendor Slug")
    invalid_url = f"{BASE_URL}/api/vendors/invalid-vendor-slug/collections/"
    print(f"GET {invalid_url}")
    
    try:
        response = requests.get(invalid_url, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 404:
            print("✅ Correctly returned 404 for invalid vendor")
        else:
            print(f"⚠️  Expected 404, got {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Connection error: {e}")
    
    # Test 4: Test with invalid collection ID
    print(f"\n🔍 Test 4: Invalid Collection ID")
    invalid_collection_url = f"{BASE_URL}/api/vendors/{vendor.slug}/collections/00000000-0000-0000-0000-000000000000/"
    print(f"GET {invalid_collection_url}")
    
    try:
        response = requests.get(invalid_collection_url, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 404:
            print("✅ Correctly returned 404 for invalid collection")
        else:
            print(f"⚠️  Expected 404, got {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Connection error: {e}")
    
    # Test 5: Test private collection (should not be visible)
    print(f"\n🔍 Test 5: Private Collection Visibility")
    try:
        # Create a private collection
        private_collection = Collection.objects.create(
            vendor=vendor,
            name='Private Collection',
            description='This should not be visible publicly',
            is_public=False
        )
        
        # Try to access it via public endpoint
        private_url = f"{BASE_URL}/api/vendors/{vendor.slug}/collections/{private_collection.id}/"
        print(f"GET {private_url}")
        
        response = requests.get(private_url, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 404:
            print("✅ Private collection correctly hidden from public access")
        else:
            print(f"⚠️  Private collection should return 404, got {response.status_code}")
        
        # Clean up
        private_collection.delete()
        
    except Exception as e:
        print(f"❌ Error testing private collection: {e}")

if __name__ == "__main__":
    test_collection_endpoints()
