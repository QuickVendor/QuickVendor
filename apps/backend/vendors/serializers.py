import re
from rest_framework import serializers
from django.utils.text import slugify
from .models import Vendor, VendorSettings, VendorProfile


class VendorProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for VendorProfile model with validation and custom methods.
    """
    
    class Meta:
        model = VendorProfile
        fields = [
            'business_name',
            'slug', 
            'whatsapp',
            'bank_name',
            'account_number',
            'account_name',
            'is_active',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['slug', 'created_at', 'updated_at']

    def validate_business_name(self, value):
        """
        Validate business_name field.
        - Required
        - Min length 3
        - Max length 100
        """
        if not value or not value.strip():
            raise serializers.ValidationError("Business name is required.")
        
        value = value.strip()
        
        if len(value) < 3:
            raise serializers.ValidationError("Business name must be at least 3 characters long.")
        
        if len(value) > 100:
            raise serializers.ValidationError("Business name cannot exceed 100 characters.")
        
        return value

    def validate_whatsapp(self, value):
        """
        Validate whatsapp field.
        - Optional
        - If provided, must be valid phone format (basic regex)
        """
        if not value:
            return value
        
        # Remove spaces and common separators
        cleaned_value = re.sub(r'[\s\-\(\)]', '', value)
        
        # Basic phone number regex: optional + followed by 10-15 digits
        phone_pattern = r'^\+?[1-9]\d{9,14}$'
        
        if not re.match(phone_pattern, cleaned_value):
            raise serializers.ValidationError(
                "WhatsApp number must be a valid phone number format. "
                "Example: +2348012345678 or 08012345678"
            )
        
        return cleaned_value

    def validate_account_number(self, value):
        """
        Validate account_number field.
        - Optional
        - If provided, must be digits only
        """
        if not value:
            return value
        
        # Remove spaces
        cleaned_value = value.replace(' ', '')
        
        if not cleaned_value.isdigit():
            raise serializers.ValidationError(
                "Account number must contain only digits."
            )
        
        if len(cleaned_value) < 8:
            raise serializers.ValidationError(
                "Account number must be at least 8 digits long."
            )
        
        if len(cleaned_value) > 20:
            raise serializers.ValidationError(
                "Account number cannot exceed 20 digits."
            )
        
        return cleaned_value

    def validate(self, attrs):
        """
        Custom validate method to ensure slug uniqueness and other cross-field validations.
        """
        business_name = attrs.get('business_name')
        
        if business_name:
            # Generate slug for uniqueness check
            base_slug = slugify(business_name)
            
            if not base_slug:
                raise serializers.ValidationError({
                    'business_name': 'Business name must contain valid characters for URL generation.'
                })
            
            # Check for slug uniqueness (excluding current instance if updating)
            instance = getattr(self, 'instance', None)
            slug = base_slug
            counter = 1
            
            while True:
                queryset = VendorProfile.objects.filter(slug=slug)
                if instance:
                    queryset = queryset.exclude(user_id=instance.user_id)
                
                if not queryset.exists():
                    break
                
                slug = f"{base_slug}-{counter}"
                counter += 1
            
            # Store the final slug for use in create/update
            attrs['_generated_slug'] = slug
        
        # Validate banking information consistency
        bank_name = attrs.get('bank_name')
        account_number = attrs.get('account_number')
        account_name = attrs.get('account_name')
        
        # If any banking field is provided, encourage providing all
        banking_fields = [bank_name, account_number, account_name]
        provided_banking_fields = [field for field in banking_fields if field]
        
        if provided_banking_fields and len(provided_banking_fields) < 3:
            # This is a warning, not an error - just inform the user
            pass  # Could add a warning message here if needed
        
        return attrs

    def create(self, validated_data):
        """
        Override create method to handle slug generation properly.
        """
        # Extract the generated slug
        generated_slug = validated_data.pop('_generated_slug', None)
        
        # Create the instance
        instance = VendorProfile(**validated_data)
        
        # Set the slug if generated
        if generated_slug:
            instance.slug = generated_slug
        
        instance.save()
        return instance

    def update(self, instance, validated_data):
        """
        Override update method to handle slug generation properly.
        """
        # Extract the generated slug
        generated_slug = validated_data.pop('_generated_slug', None)
        
        # Update fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # Update slug if business_name changed
        if 'business_name' in validated_data and generated_slug:
            instance.slug = generated_slug
        
        instance.save()
        return instance

    def to_representation(self, instance):
        """
        Customize the serialized output.
        """
        data = super().to_representation(instance)
        
        # Add computed fields
        data['has_complete_banking_info'] = all([
            instance.bank_name,
            instance.account_number,
            instance.account_name
        ])
        
        data['contact_info_complete'] = bool(instance.whatsapp)
        
        return data


class VendorSerializer(serializers.ModelSerializer):
    """
    Serializer for the existing Vendor model.
    """
    class Meta:
        model = Vendor
        fields = [
            'id', 'business_name', 'slug', 'description', 'logo', 
            'banner', 'email', 'phone', 'website', 'city', 
            'state', 'country', 'is_verified'
        ]


class VendorSettingsSerializer(serializers.ModelSerializer):
    """
    Serializer for VendorSettings model.
    """
    class Meta:
        model = VendorSettings
        fields = [
            'email_notifications', 'sms_notifications', 
            'min_order_amount', 'processing_time', 'return_policy'
        ]