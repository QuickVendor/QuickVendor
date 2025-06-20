#!/bin/bash

# Product CRUD API Test Script
# This script tests the Product CRUD endpoints

echo "🧪 Testing Product CRUD API"
echo "=============================="

# Set the base URL
BASE_URL="http://localhost:8000"

# First, let's create a test vendor and get the ID
echo "📝 Creating test vendor..."

VENDOR_ID=$(python manage.py shell -c "
import uuid
from vendors.models import VendorProfile

# Check if test vendor already exists
existing_vendor = VendorProfile.objects.filter(business_name='Test Electronics Store').first()
if existing_vendor:
    print(str(existing_vendor.user_id))
else:
    vendor_user_id = uuid.uuid4()
    vendor = VendorProfile.objects.create(
        user_id=vendor_user_id,
        business_name='Test Electronics Store',
        whatsapp='+2348012345678',
        bank_name='First Bank',
        account_number='1234567890',
        account_name='Test Electronics Ltd'
    )
    print(str(vendor_user_id))
" 2>/dev/null)

if [ -z "$VENDOR_ID" ]; then
    echo "❌ Failed to create/get vendor ID"
    exit 1
fi

echo "✅ Vendor ID: $VENDOR_ID"
echo ""

# Test 1: List products (should be empty initially)
echo "🔍 Test 1: List vendor's products"
response=$(curl -s -X GET "$BASE_URL/api/products/" \
  -H "X-Vendor-User-ID: $VENDOR_ID")
echo "Response: $response"
echo ""

# Test 2: Create a new product
echo "➕ Test 2: Create new product"
response=$(curl -s -X POST "$BASE_URL/api/products/" \
  -H "Content-Type: application/json" \
  -H "X-Vendor-User-ID: $VENDOR_ID" \
  -d '{
    "name": "iPhone 15 Pro",
    "description": "Latest iPhone with advanced features",
    "price": "999.99",
    "quantity": 10,
    "image_url": "https://example.com/iphone15.jpg",
    "is_available": true
  }')
echo "Response: $response"

# Extract product ID from response
PRODUCT_ID=$(echo $response | python -c "
import sys, json
try:
    data = json.load(sys.stdin)
    if 'data' in data and 'id' in data['data']:
        print(data['data']['id'])
except:
    pass
" 2>/dev/null)

echo "Product ID: $PRODUCT_ID"
echo ""

if [ -n "$PRODUCT_ID" ]; then
    # Test 3: Get specific product
    echo "📖 Test 3: Get specific product"
    response=$(curl -s -X GET "$BASE_URL/api/products/$PRODUCT_ID/" \
      -H "X-Vendor-User-ID: $VENDOR_ID")
    echo "Response: $response"
    echo ""

    # Test 4: Update product
    echo "✏️  Test 4: Update product"
    response=$(curl -s -X PUT "$BASE_URL/api/products/$PRODUCT_ID/" \
      -H "Content-Type: application/json" \
      -H "X-Vendor-User-ID: $VENDOR_ID" \
      -d '{
        "name": "iPhone 15 Pro Max",
        "description": "Updated iPhone model with larger screen",
        "price": "1099.99",
        "quantity": 8,
        "image_url": "https://example.com/iphone15-pro-max.jpg",
        "is_available": true
      }')
    echo "Response: $response"
    echo ""

    # Test 5: List products again (should show the created product)
    echo "📋 Test 5: List products again"
    response=$(curl -s -X GET "$BASE_URL/api/products/" \
      -H "X-Vendor-User-ID: $VENDOR_ID")
    echo "Response: $response"
    echo ""
else
    echo "⚠️  Skipping product-specific tests due to creation failure"
fi

# Test 6: Test error cases
echo "❌ Test 6: Test error cases"

echo "  6a. No authentication header:"
response=$(curl -s -X GET "$BASE_URL/api/products/")
echo "  Response: $response"

echo "  6b. Invalid product data:"
response=$(curl -s -X POST "$BASE_URL/api/products/" \
  -H "Content-Type: application/json" \
  -H "X-Vendor-User-ID: $VENDOR_ID" \
  -d '{
    "name": "AB",
    "price": "0",
    "quantity": -1
  }')
echo "  Response: $response"

echo "  6c. Non-existent product:"
response=$(curl -s -X GET "$BASE_URL/api/products/12345678-1234-1234-1234-123456789012/" \
  -H "X-Vendor-User-ID: $VENDOR_ID")
echo "  Response: $response"

echo ""
echo "🎉 Testing completed!"
echo ""
echo "💡 To test manually, use this vendor ID: $VENDOR_ID"
