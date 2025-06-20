
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import VendorHeader from "@/components/VendorHeader";

const CollectionPage = () => {
  const { slug, id } = useParams();
  
  // Mock data - replace with real Supabase data
  const vendor = {
    name: "Tech Gadgets Store",
    description: "Your trusted electronics partner",
    logo: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=100&h=100&fit=crop"
  };

  const collection = {
    name: "Smartphones",
    description: "Latest smartphones from top brands"
  };

  const products = [
    {
      id: "1",
      name: "iPhone 15 Pro",
      price: 999,
      image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop",
      inStock: true
    },
    {
      id: "5",
      name: "Samsung Galaxy S24",
      price: 899,
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
      inStock: true
    },
    {
      id: "6",
      name: "Google Pixel 8",
      price: 699,
      image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=400&fit=crop",
      inStock: true
    }
  ];

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

        {/* Collection Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{collection.name}</h1>
          <p className="text-gray-600">{collection.description}</p>
        </div>

        {/* Products Grid */}
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

export default CollectionPage;
