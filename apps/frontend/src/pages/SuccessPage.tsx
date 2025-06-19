
import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Home, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const SuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const customerName = searchParams.get('customer') || 'Customer';
  const productName = searchParams.get('product') || 'Product';
  const vendorName = searchParams.get('vendor') || 'Vendor';

  useEffect(() => {
    // Add confetti or celebration animation here if desired
    document.title = 'Purchase Confirmed - Quick Vendor';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Purchase Confirmed!</CardTitle>
          <CardDescription>
            Your inquiry has been sent successfully
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Hi <span className="font-medium">{customerName}</span>!
            </p>
            <p className="text-sm">
              Your inquiry for <span className="font-medium">{productName}</span> has been sent to <span className="font-medium">{vendorName}</span>.
            </p>
            <p className="text-sm text-muted-foreground">
              They will contact you shortly via WhatsApp to complete your purchase.
            </p>
          </div>
          
          <div className="space-y-2 pt-4">
            <Button asChild className="w-full">
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Browse More Products
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="w-full">
              <Link to={`/${searchParams.get('vendor-slug') || ''}`}>
                <Package className="mr-2 h-4 w-4" />
                View {vendorName}'s Store
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuccessPage;
