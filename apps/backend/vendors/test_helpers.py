import uuid
from .models import VendorProfile


def create_test_vendor_profile():
    """
    Helper function to create a test vendor profile for development.
    """
    test_user_id = uuid.uuid4()
    
    vendor_profile = VendorProfile.objects.create(
        user_id=test_user_id,
        business_name="Test Electronics Store",
        whatsapp="+2348012345678",
        bank_name="First Bank",
        account_number="1234567890",
        account_name="Test Electronics Ltd"
    )
    
    print(f"Created test vendor profile:")
    print(f"User ID: {test_user_id}")
    print(f"Business Name: {vendor_profile.business_name}")
    print(f"Slug: {vendor_profile.slug}")
    
    return test_user_id, vendor_profile


if __name__ == "__main__":
    create_test_vendor_profile()