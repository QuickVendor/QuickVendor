#!/usr/bin/env python
"""
Test script for the new public product endpoints
"""
import os
import django
import requests
import json

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'quickvendor.settings')
django.setup()

from products.models import Product
from vendors.models import VendorProfile

BASE_URL = "http://localhost:8000"

def test_public_endpoints():
    print("🧪 Testing Public Product Endpoints")
    print("===================================")
    
    # Get the test vendor
    try:
        vendor = VendorProfile.objects.first()
        if not vendor:
            print("❌ No vendor found in database")
            return
        
        print(f"✅ Using vendor: {vendor.business_name} (slug: {vendor.slug})")
        
        # Check if there are products
        products = Product.objects.filter(vendor=vendor, is_available=True)
        print(f"✅ Found {products.count()} available products for this vendor")
        
        if products.count() == 0:
            # Create a test product
            print("📝 Creating test product...")
            product = Product.objects.create(
                name="Test Wireless Headphones",
                description="High-quality wireless headphones with noise cancellation",
                price=99.99,
                quantity=50,
                is_available=True,
                vendor=vendor
            )
            print(f"✅ Created test product: {product.name} (ID: {product.id})")
        
        # Test 1: List vendor products (Public endpoint)
        print("\n🔍 Test 1: Public Vendor Products List")
        url = f"{BASE_URL}/api/products/public/{vendor.slug}/"
        print(f"GET {url}")
        
        try:
            response = requests.get(url, timeout=10)
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Success! Found {data.get('count', 0)} products")
                print(f"   Vendor: {data.get('vendor', {}).get('business_name', 'N/A')}")
                print(f"   Page Size: {data.get('page_size', 'N/A')}")
                
                if data.get('results'):
                    first_product = data['results'][0]
                    product_id = first_product['id']
                    print(f"   First Product: {first_product['name']} - ${first_product['price']}")
                    
                    # Test 2: Get single product details (Public endpoint)
                    print(f"\n🔍 Test 2: Public Product Detail")
                    detail_url = f"{BASE_URL}/api/products/public/{vendor.slug}/{product_id}/"
                    print(f"GET {detail_url}")
                    
                    detail_response = requests.get(detail_url, timeout=10)
                    print(f"Status Code: {detail_response.status_code}")
                    
                    if detail_response.status_code == 200:
                        detail_data = detail_response.json()
                        print(f"✅ Success! Product Details Retrieved")
                        print(f"   Name: {detail_data['name']}")
                        print(f"   Price: ${detail_data['price']}")
                        print(f"   Available: {detail_data['is_available']}")
                        print(f"   Vendor: {detail_data.get('vendor', {}).get('business_name', 'N/A')}")
                    else:
                        print(f"❌ Product detail failed: {detail_response.text}")
                else:
                    print("⚠️  No products in response")
            else:
                print(f"❌ Request failed: {response.text}")
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Connection error: {e}")
        
        # Test 3: Test with invalid vendor slug
        print(f"\n🔍 Test 3: Invalid Vendor Slug")
        invalid_url = f"{BASE_URL}/api/products/public/invalid-vendor-slug/"
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
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_public_endpoints()
