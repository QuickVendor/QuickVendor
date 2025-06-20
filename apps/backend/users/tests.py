from django.test import TestCase
from django.urls import reverse
from .models import User  # Assuming you have a User model in models.py

class UserModelTests(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpassword',
            email='testuser@example.com'
        )

    def test_user_creation(self):
        self.assertEqual(self.user.username, 'testuser')
        self.assertEqual(self.user.email, 'testuser@example.com')
        self.assertTrue(self.user.check_password('testpassword'))

class UserViewTests(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpassword',
            email='testuser@example.com'
        )

    def test_user_list_view(self):
        response = self.client.get(reverse('user-list'))  # Adjust the URL name as needed
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'testuser')

    def test_user_detail_view(self):
        response = self.client.get(reverse('user-detail', args=[self.user.id]))  # Adjust the URL name as needed
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'testuser')