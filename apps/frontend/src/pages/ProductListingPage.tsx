
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/ProductCard";
import VendorHeader from "@/components/VendorHeader";

const ProductListingPage = () => {
  const { slug } = useParams();
  
  // Mock data - replace with real Supabase data
  const vendor = {
    name: "Tech Gadgets Store",
    description: "Your trusted electronics partner",
    logo: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=100&h=100&fit=crop"
  };

  const collections = [
    { id: "1", name: "Smartphones", count: 15 },
    { id: "2", name: "Laptops", count: 8 },
    { id: "3", name: "Accessories", count: 25 }
  ];

  const products = [
    {
      id: "1",
      name: "iPhone 15 Pro",
      price: 999,
      image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop",
      inStock: true
    },
    {
      id: "2", 
      name: "MacBook Pro M3",
      price: 1999,
      image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop",
      inStock: true
    },
    {
      id: "3",
      name: "AirPods Pro",
      price: 249,
      image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c6ba43?w=400&h=400&fit=crop",
      inStock: false
    },
    {
      id: "4",
      name: "iPad Air",
      price: 599,
      image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop",
      inStock: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <VendorHeader vendor={vendor} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation */}
        <div className="flex items-center mb-6">
          <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Collections */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Shop by Category</h2>
          <div className="flex flex-wrap gap-3">
            {collections.map((collection) => (
              <Link 
                key={collection.id}
                to={`/vendor/${slug}/collections/${collection.id}`}
              >
                <Badge variant="secondary" className="px-4 py-2 text-sm hover:bg-gray-200 cursor-pointer">
                  {collection.name} ({collection.count})
                </Badge>
              </Link>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">All Products</h2>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Grid className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard 
              key={product.id}
              product={product}
              vendorSlug={slug!}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductListingPage;
