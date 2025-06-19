
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Copy, 
  Share, 
  Heart, 
  Star,
  Plus,
  Minus,
  ShoppingCart,
  Check
} from 'lucide-react';
import { toast } from 'sonner';

interface SingleProductViewProps {
  product: any;
  onBack: () => void;
}

const SingleProductView = ({ product, onBack }: SingleProductViewProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [urlCopied, setUrlCopied] = useState(false);

  // Mock product data with multiple images
  const productData = {
    id: product?.id || 1,
    name: product?.name || 'Wireless Bluetooth Headphones',
    price: product?.price || 79.99,
    originalPrice: 99.99,
    description: `Experience premium sound quality with these wireless Bluetooth headphones. Featuring active noise cancellation, 30-hour battery life, and comfortable over-ear design. Perfect for music lovers, gamers, and professionals.

Key Features:
• Active Noise Cancellation (ANC)
• 30-hour battery life with quick charge
• Premium drivers for crystal clear sound
• Comfortable over-ear design
• Built-in microphone for calls
• Compatible with all Bluetooth devices`,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1545127398-14699f92334b?w=600&h=600&fit=crop'
    ],
    stock: product?.stock || 45,
    rating: 4.8,
    reviews: 156,
    category: 'Electronics'
  };

  const shareUrl = `https://quickvendor.com/p/${productData.id}`;

  const getStockStatus = () => {
    if (productData.stock === 0) return { text: 'Sold Out', color: 'bg-red-100 text-red-800' };
    if (productData.stock <= 5) return { text: `Only ${productData.stock} left`, color: 'bg-orange-100 text-orange-800' };
    return { text: 'In Stock', color: 'bg-green-100 text-green-800' };
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(shareUrl);
    setUrlCopied(true);
    toast.success('Product URL copied to clipboard!');
    setTimeout(() => setUrlCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: productData.name,
          text: `Check out this amazing product: ${productData.name}`,
          url: shareUrl,
        });
      } catch (error) {
        handleCopyUrl();
      }
    } else {
      handleCopyUrl();
    }
  };

  const handleAddToCart = () => {
    toast.success(`Added ${quantity} item(s) to cart!`);
  };

  const adjustQuantity = (delta: number) => {
    const newQuantity = Math.max(1, Math.min(productData.stock, quantity + delta));
    setQuantity(newQuantity);
  };

  const stockStatus = getStockStatus();

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Button>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyUrl}
            className="flex items-center space-x-2"
          >
            {urlCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{urlCopied ? 'Copied!' : 'Copy Link'}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="flex items-center space-x-2"
          >
            <Share className="w-4 h-4" />
            <span>Share</span>
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="relative aspect-square">
              <img
                src={productData.images[currentImageIndex]}
                alt={productData.name}
                className="w-full h-full object-cover"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`absolute top-4 right-4 ${
                  isWishlisted ? 'text-red-500' : 'text-gray-400'
                } hover:text-red-500`}
              >
                <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </Card>

          {/* Image Thumbnails */}
          <div className="grid grid-cols-4 gap-2">
            {productData.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                  currentImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                }`}
              >
                <img
                  src={image}
                  alt={`${productData.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant="secondary">{productData.category}</Badge>
              <Badge className={stockStatus.color}>
                {stockStatus.text}
              </Badge>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {productData.name}
            </h1>

            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(productData.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {productData.rating} ({productData.reviews} reviews)
              </span>
            </div>

            <div className="flex items-center space-x-3 mb-6">
              <span className="text-3xl font-bold text-green-600">
                ${productData.price}
              </span>
              <span className="text-lg text-gray-500 line-through">
                ${productData.originalPrice}
              </span>
              <Badge className="bg-red-100 text-red-800">
                Save ${(productData.originalPrice - productData.price).toFixed(2)}
              </Badge>
            </div>
          </div>

          <div className="prose max-w-none">
            <h3 className="text-lg font-semibold mb-3">Product Description</h3>
            <div className="text-gray-700 whitespace-pre-line">
              {productData.description}
            </div>
          </div>

          {/* Quantity and Add to Cart */}
          {productData.stock > 0 && (
            <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-green-50">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <span className="font-medium">Quantity:</span>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => adjustQuantity(-1)}
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-12 text-center font-semibold">
                        {quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => adjustQuantity(1)}
                        disabled={quantity >= productData.stock}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <Button
                    onClick={handleAddToCart}
                    className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold py-3 flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Add to Cart - ${(productData.price * quantity).toFixed(2)}</span>
                  </Button>

                  <p className="text-sm text-gray-600 text-center">
                    Free shipping on orders over $50
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {productData.stock === 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4 text-center">
                <p className="text-red-800 font-semibold">This product is currently sold out</p>
                <p className="text-red-600 text-sm mt-1">Check back soon for restocking updates</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleProductView;
