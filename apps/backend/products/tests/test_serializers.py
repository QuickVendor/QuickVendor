from django.test import TestCase
from products.serializers import ProductSerializer, ProductListSerializer, CollectionSerializer
from products.models import Product, Collection
from vendors.models import VendorProfile
import uuid


class ProductSerializerTest(TestCase):
    """Test ProductSerializer functionality."""
    
    def setUp(self):
        """Set up test data."""
        self.vendor = VendorProfile.objects.create(
            user_id=uuid.uuid4(),
            business_name="Test Store"
        )
    
    def test_valid_product_data(self):
        """Test serializer with valid product data."""
        data = {
            'name': 'Test Product',
            'description': 'A test product',
            'price': '99.99',
            'quantity': 10,
            'image_url': 'https://example.com/image.jpg',
            'is_available': True
        }
        
        serializer = ProductSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.validated_data['name'], 'Test Product')
        self.assertEqual(float(serializer.validated_data['price']), 99.99)
    
    def test_invalid_price(self):
        """Test serializer with invalid price."""
        data = {
            'name': 'Test Product',
            'price': '0.00',  # Invalid: must be > 0
            'quantity': 10,
        }
        
        serializer = ProductSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('price', serializer.errors)
    
    def test_invalid_name_too_short(self):
        """Test serializer with name too short."""
        data = {
            'name': 'AB',  # Invalid: too short
            'price': '99.99',
            'quantity': 10,
        }
        
        serializer = ProductSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('name', serializer.errors)
    
    def test_negative_quantity(self):
        """Test serializer with negative quantity."""
        data = {
            'name': 'Test Product',
            'price': '99.99',
            'quantity': -5,  # Invalid: negative
        }
        
        serializer = ProductSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('quantity', serializer.errors)


class ProductListSerializerTest(TestCase):
    """Test ProductListSerializer functionality."""
    
    def setUp(self):
        """Set up test data."""
        self.vendor = VendorProfile.objects.create(
            user_id=uuid.uuid4(),
            business_name="Test Store"
        )
        
        self.product = Product.objects.create(
            vendor=self.vendor,
            name='Test Product',
            price=99.99,
            quantity=10
        )
    
    def test_serialized_fields(self):
        """Test that only expected fields are serialized."""
        serializer = ProductListSerializer(self.product)
        expected_fields = {'id', 'name', 'price', 'image_url', 'is_available'}
        self.assertEqual(set(serializer.data.keys()), expected_fields)


class CollectionSerializerTest(TestCase):
    """Test CollectionSerializer functionality."""
    
    def setUp(self):
        """Set up test data."""
        self.vendor = VendorProfile.objects.create(
            user_id=uuid.uuid4(),
            business_name="Test Store"
        )
        
        self.collection = Collection.objects.create(
            vendor=self.vendor,
            name='Test Collection'
        )
    
    def test_product_count_field(self):
        """Test that product_count is computed correctly."""
        serializer = CollectionSerializer(self.collection)
        self.assertIn('product_count', serializer.data)
        self.assertEqual(serializer.data['product_count'], 0)
    
    def test_invalid_name_too_short(self):
        """Test serializer with name too short."""
        data = {
            'name': 'A',  # Invalid: too short
            'description': 'Test collection',
            'is_public': True
        }
        
        serializer = CollectionSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('name', serializer.errors)