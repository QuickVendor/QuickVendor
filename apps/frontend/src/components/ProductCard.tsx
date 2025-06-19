
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  inStock: boolean;
}

interface ProductCardProps {
  product: Product;
  vendorSlug: string;
}

const ProductCard = ({ product, vendorSlug }: ProductCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-square bg-gray-100 relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {!product.inStock && (
          <Badge variant="destructive" className="absolute top-2 right-2">
            Out of Stock
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-2xl font-bold text-indigo-600">${product.price}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link to={`/vendor/${vendorSlug}/product/${product.id}`} className="w-full">
          <Button 
            className="w-full" 
            disabled={!product.inStock}
            variant={product.inStock ? "default" : "secondary"}
          >
            {product.inStock ? "View Details" : "Out of Stock"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
