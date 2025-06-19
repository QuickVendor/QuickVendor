
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Star, Shield, Truck, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import VendorHeader from "@/components/VendorHeader";

const ProductDetailPage = () => {
  const { slug, id } = useParams();
  
  // Mock data - replace with real Supabase data
  const vendor = {
    name: "Tech Gadgets Store",
    description: "Your trusted electronics partner",
    logo: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=100&h=100&fit=crop"
  };

  const product = {
    id: "1",
    name: "iPhone 15 Pro",
    price: 999,
    images: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop"
    ],
    description: "The iPhone 15 Pro features a titanium design, A17 Pro chip, and an advanced camera system. Experience the most powerful iPhone ever created.",
    features: [
      "6.1-inch Super Retina XDR display",
      "A17 Pro chip with 6-core GPU",
      "Pro camera system with 48MP main camera",
      "Titanium design with textured matte glass back",
      "Up to 23 hours video playback"
    ],
    inStock: true,
    rating: 4.8,
    reviews: 124
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <VendorHeader vendor={vendor} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation */}
        <div className="flex items-center mb-6">
          <Link to={`/vendor/${slug}/products`} className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Products
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden">
              <img 
                src={product.images[0]} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <div key={index} className="aspect-square bg-white rounded-lg overflow-hidden border-2 border-gray-200 cursor-pointer hover:border-indigo-500">
                  <img 
                    src={image} 
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-1">{product.rating}</span>
                  <span className="text-gray-600 ml-1">({product.reviews} reviews)</span>
                </div>
                {product.inStock ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    In Stock
                  </Badge>
                ) : (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
              </div>
              <p className="text-4xl font-bold text-indigo-600 mb-4">${product.price}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Key Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-600">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full mr-3 flex-shrink-0"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Purchase Button */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 mr-1" />
                      Secure Payment
                    </div>
                    <div className="flex items-center">
                      <Truck className="h-4 w-4 mr-1" />
                      Fast Delivery
                    </div>
                    <div className="flex items-center">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      WhatsApp Support
                    </div>
                  </div>
                  <Link to={`/vendor/${slug}/product/${id}/buy`}>
                    <Button 
                      className="w-full text-lg py-6" 
                      disabled={!product.inStock}
                    >
                      {product.inStock ? "Purchase Now" : "Out of Stock"}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
