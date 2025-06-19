
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseProductViewTrackerProps {
  productId: string;
  vendorId: string;
  enabled?: boolean;
}

export const useProductViewTracker = ({ productId, vendorId, enabled = true }: UseProductViewTrackerProps) => {
  useEffect(() => {
    if (!enabled || !productId || !vendorId) return;

    const trackView = async () => {
      try {
        // Get IP and user agent from browser
        const userAgent = navigator.userAgent;
        
        // Insert view record
        await supabase.from('product_views').insert({
          product_id: productId,
          vendor_id: vendorId,
          user_agent: userAgent,
          viewer_ip: null // We'll let the server handle IP detection if needed
        });

        console.log('Product view tracked:', productId);
      } catch (error) {
        console.error('Error tracking product view:', error);
      }
    };

    // Track view after a short delay to ensure page load
    const timer = setTimeout(trackView, 1000);

    return () => clearTimeout(timer);
  }, [productId, vendorId, enabled]);
};
