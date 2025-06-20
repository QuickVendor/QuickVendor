from rest_framework import serializers
from .models import APIKey, SystemConfiguration


class APIKeySerializer(serializers.ModelSerializer):
    class Meta:
        model = APIKey
        fields = ['id', 'name', 'service', 'created_at']
        # Exclude the actual key for security


class SystemConfigurationSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemConfiguration
        fields = ['id', 'key', 'value', 'description']