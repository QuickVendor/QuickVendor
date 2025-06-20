
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Copy, MessageCircle, CreditCard, Building2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import VendorHeader from "@/components/VendorHeader";

const purchaseSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
});

type PurchaseForm = z.infer<typeof purchaseSchema>;

const PurchasePage = () => {
  const { slug, id } = useParams();
  const { toast } = useToast();
  
  // Mock data - replace with real Supabase data
  const vendor = {
    name: "Tech Gadgets Store",
    description: "Your trusted electronics partner",
    logo: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=100&h=100&fit=crop",
    bankInfo: {
      bankName: "First National Bank",
      accountName: "Tech Gadgets Store Ltd",
      accountNumber: "1234567890",
      routingNumber: "987654321"
    },
    whatsapp: "+1234567890"
  };

  const product = {
    id: "1",
    name: "iPhone 15 Pro",
    price: 999,
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop"
  };

  const { register, handleSubmit, formState: { errors }, watch } = useForm<PurchaseForm>({
    resolver: zodResolver(purchaseSchema)
  });

  const watchedData = watch();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The information has been copied to your clipboard.",
    });
  };

  const handlePurchase = (data: PurchaseForm) => {
    const message = `Hi! I have paid for ${product.name} ($${product.price}). 

My details:
Name: ${data.fullName}
Email: ${data.email}
Phone: ${data.phone}

Please confirm my order. Thank you!`;

    const whatsappUrl = `https://wa.me/${vendor.whatsapp.replace('+', '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <VendorHeader vendor={vendor} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation */}
        <div className="flex items-center mb-6">
          <Link to={`/vendor/${slug}/product/${id}`} className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Product
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-2xl font-bold text-indigo-600">${product.price}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bank Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800 mb-3 font-medium">
                    Please make payment to the following account:
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Bank Name:</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{vendor.bankInfo.bankName}</span>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => copyToClipboard(vendor.bankInfo.bankName)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Account Name:</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{vendor.bankInfo.accountName}</span>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => copyToClipboard(vendor.bankInfo.accountName)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Account Number:</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-mono">{vendor.bankInfo.accountNumber}</span>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => copyToClipboard(vendor.bankInfo.accountNumber)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Amount:</span>
                      <span className="text-lg font-bold text-indigo-600">${product.price}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customer Information Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Your Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(handlePurchase)} className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      {...register("fullName")}
                      className={errors.fullName ? "border-red-500" : ""}
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      {...register("email")}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      {...register("phone")}
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>

                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      className="w-full text-lg py-6"
                      disabled={!watchedData.fullName || !watchedData.email || !watchedData.phone}
                    >
                      <MessageCircle className="h-5 w-5 mr-2" />
                      I Have Paid - Contact Vendor
                    </Button>
                    
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      This will open WhatsApp with a pre-filled message to the vendor
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchasePage;
