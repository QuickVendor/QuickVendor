from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import generics, status

from .models import APIKey, SystemConfiguration, APIRequestLog
from .serializers import APIKeySerializer, SystemConfigurationSerializer


@api_view(['GET'])
def health_check(request):
    """
    Simple health check endpoint.
    """
    return JsonResponse({
        'status': 'ok',
        'message': 'QuickVendor API is running',
        'version': '1.0.0'
    })


class SystemConfigurationListView(generics.ListAPIView):
    """
    List all system configurations.
    """
    queryset = SystemConfiguration.objects.filter(is_active=True)
    serializer_class = SystemConfigurationSerializer


class APIKeyListView(generics.ListAPIView):
    """
    List all API keys (excluding the actual key values for security).
    """
    queryset = APIKey.objects.filter(is_active=True)
    serializer_class = APIKeySerializer


@api_view(['GET'])
def api_stats(request):
    """
    Get basic API statistics.
    """
    total_requests = APIRequestLog.objects.count()
    successful_requests = APIRequestLog.objects.filter(
        status_code__range=[200, 299]
    ).count()

    success_rate = 0
    if total_requests > 0:
        success_rate = round((successful_requests / total_requests) * 100, 2)

    return Response({
        'total_requests': total_requests,
        'successful_requests': successful_requests,
        'success_rate': f"{success_rate}%",
        'active_api_keys': APIKey.objects.filter(is_active=True).count(),
        'system_configs': SystemConfiguration.objects.filter(is_active=True).count()
    })