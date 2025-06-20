import uuid
from vendors.models import VendorProfile
from .models import Product


def create_test_vendor_and_products():
    """
    Helper function to create test vendor and products for API testing.
    """
    # Create test vendor
    vendor_user_id = uuid.uuid4()
    vendor = VendorProfile.objects.create(
        user_id=vendor_user_id,
        business_name="Test Electronics Store",
        whatsapp="+2348012345678",
        bank_name="First Bank",
        account_number="1234567890",
        account_name="Test Electronics Ltd"
    )
    
    # Create test products
    products = []
    product_data = [
        {
            'name': 'iPhone 15 Pro',
            'description': 'Latest iPhone with advanced features',
            'price': 999.99,
            'quantity': 10,
            'image_url': 'https://example.com/iphone15.jpg'
        },
        {
            'name': 'MacBook Pro M3',
            'description': 'Powerful laptop for professionals',
            'price': 1999.99,
            'quantity': 5,
            'image_url': 'https://example.com/macbook.jpg'
        },
        {
            'name': 'AirPods Pro',
            'description': 'Wireless earphones with noise cancellation',
            'price': 249.99,
            'quantity': 20,
            'image_url': 'https://example.com/airpods.jpg'
        }
    ]
    
    for data in product_data:
        product = Product.objects.create(vendor=vendor, **data)
        products.append(product)
    
    print(f"Created test data:")
    print(f"Vendor ID: {vendor_user_id}")
    print(f"Business: {vendor.business_name}")
    print(f"Products created: {len(products)}")
    
    for product in products:
        print(f"  - {product.name} (ID: {product.id})")
    
    return vendor_user_id, vendor, products


if __name__ == "__main__":
    # Run this to create test data
    create_test_vendor_and_products()
