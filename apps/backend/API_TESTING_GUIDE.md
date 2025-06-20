# Product CRUD API Testing Guide

## Overview

The Product CRUD API provides authenticated vendors with the ability to manage their products. The API includes proper authentication, validation, and error handling.

## API Endpoints

### Authenticated Vendor Endpoints

#### 1. List/Create Products
- **URL**: `/api/products/`
- **Methods**: GET (list), POST (create)
- **Permission**: IsVendorAuthenticated
- **Authentication**: Vendor User ID in header

#### 2. Product Detail Operations
- **URL**: `/api/products/<uuid:pk>/`
- **Methods**: GET (retrieve), PUT (update), DELETE (delete)
- **Permission**: IsVendorAuthenticated
- **Authentication**: Vendor User ID in header

## Authentication

For testing, the API expects the vendor user ID in the request header:
```
X-Vendor-User-ID: <vendor-uuid>
```

## Testing Steps

### 1. Create Test Data

First, create a test vendor profile:

```bash
cd /home/princewillelebhose/Documents/Projects/QuickVendor/apps/backend

python manage.py shell -c "
import uuid
from vendors.models import VendorProfile

vendor_user_id = uuid.uuid4()
vendor = VendorProfile.objects.create(
    user_id=vendor_user_id,
    business_name='Test Electronics Store',
    whatsapp='+2348012345678',
    bank_name='First Bank',
    account_number='1234567890',
    account_name='Test Electronics Ltd'
)
print('Vendor ID:', vendor_user_id)
"
```

**Save the vendor ID from the output for testing!**

### 2. Test API Endpoints

Replace `YOUR_VENDOR_ID` with the actual UUID from step 1.

#### List Vendor's Products (Initially Empty)
```bash
curl -X GET "http://localhost:8000/api/products/" \
  -H "X-Vendor-User-ID: YOUR_VENDOR_ID"
```

Expected Response:
```json
{
  "count": 0,
  "next": null,
  "previous": null,
  "results": []
}
```

#### Create a New Product
```bash
curl -X POST "http://localhost:8000/api/products/" \
  -H "Content-Type: application/json" \
  -H "X-Vendor-User-ID: YOUR_VENDOR_ID" \
  -d '{
    "name": "iPhone 15 Pro",
    "description": "Latest iPhone with advanced features",
    "price": "999.99",
    "quantity": 10,
    "image_url": "https://example.com/iphone15.jpg",
    "is_available": true
  }'
```

Expected Response:
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": "product-uuid-here",
    "name": "iPhone 15 Pro",
    "description": "Latest iPhone with advanced features",
    "price": "999.99",
    "quantity": 10,
    "image_url": "https://example.com/iphone15.jpg",
    "is_available": true
  }
}
```

#### Retrieve Specific Product
```bash
curl -X GET "http://localhost:8000/api/products/PRODUCT_ID/" \
  -H "X-Vendor-User-ID: YOUR_VENDOR_ID"
```

#### Update Product
```bash
curl -X PUT "http://localhost:8000/api/products/PRODUCT_ID/" \
  -H "Content-Type: application/json" \
  -H "X-Vendor-User-ID: YOUR_VENDOR_ID" \
  -d '{
    "name": "iPhone 15 Pro Max",
    "description": "Updated iPhone model with larger screen",
    "price": "1099.99",
    "quantity": 8,
    "image_url": "https://example.com/iphone15-pro-max.jpg",
    "is_available": true
  }'
```

#### Delete Product
```bash
curl -X DELETE "http://localhost:8000/api/products/PRODUCT_ID/" \
  -H "X-Vendor-User-ID: YOUR_VENDOR_ID"
```

### 3. Test Error Cases

#### Missing Authentication
```bash
curl -X GET "http://localhost:8000/api/products/"
```

Expected Response (401):
```json
{
  "error": "Authentication required",
  "message": "Vendor user ID not found in request"
}
```

#### Invalid Product Data
```bash
curl -X POST "http://localhost:8000/api/products/" \
  -H "Content-Type: application/json" \
  -H "X-Vendor-User-ID: YOUR_VENDOR_ID" \
  -d '{
    "name": "AB",
    "price": "0",
    "quantity": -1
  }'
```

Expected Response (400):
```json
{
  "error": "Validation failed",
  "message": "Invalid data provided",
  "details": {
    "name": ["Product name must be at least 3 characters long."],
    "price": ["Price must be greater than 0."],
    "quantity": ["Quantity cannot be negative."]
  }
}
```

#### Non-existent Product
```bash
curl -X GET "http://localhost:8000/api/products/12345678-1234-1234-1234-123456789012/" \
  -H "X-Vendor-User-ID: YOUR_VENDOR_ID"
```

Expected Response (404):
```json
{
  "error": "Product not found",
  "message": "The requested product does not exist or you do not have access to it"
}
```

## Features Implemented

✅ **ProductListCreateView** - List and create products for authenticated vendor  
✅ **ProductDetailView** - Retrieve, update, delete specific products  
✅ **Vendor filtering** - Users only see their own products  
✅ **Automatic vendor assignment** - Products automatically assigned to authenticated vendor  
✅ **Comprehensive validation** - Name, price, quantity validation  
✅ **Error handling** - Proper HTTP status codes and error messages  
✅ **Permission checks** - Object-level permissions for vendor ownership  
✅ **Database transactions** - Atomic operations for data integrity  
✅ **Pagination** - Built-in pagination for product lists  
✅ **Filtering & Search** - Filter by availability, quantity; search by name/description  

## API Response Formats

### Success Responses
- **200 OK** - Successful retrieval/update
- **201 Created** - Successful creation
- **204 No Content** - Successful deletion

### Error Responses
- **400 Bad Request** - Validation errors
- **401 Unauthorized** - Missing authentication
- **403 Forbidden** - Permission denied
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Server errors

All error responses follow this format:
```json
{
  "error": "Error Type",
  "message": "Human-readable error message",
  "details": "Additional error details (optional)"
}
```

## Next Steps

1. **Authentication Middleware** - Replace header-based auth with JWT token validation
2. **Public Product Views** - Add public endpoints for customers to browse products
3. **Image Upload** - Replace URL fields with actual file upload handling
4. **Advanced Filtering** - Add category, price range, and other filters
5. **Bulk Operations** - Add endpoints for bulk product operations
