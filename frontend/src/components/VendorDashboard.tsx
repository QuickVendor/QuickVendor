
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  TrendingUp, 
  Package, 
  Eye, 
  DollarSign,
  Plus,
  Edit,
  Copy,
  Trash2,
  Search,
  Layers,
  Link,
  AlertTriangle
} from 'lucide-react';

interface VendorDashboardProps {
  onCreateProduct: () => void;
  onViewProduct: (product: any) => void;
  onManageCollections: () => void;
  onViewAnalytics: () => void;
  onManageLinks: () => void;
}

const VendorDashboard = ({ 
  onCreateProduct, 
  onViewProduct, 
  onManageCollections,
  onViewAnalytics,
  onManageLinks 
}: VendorDashboardProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

  // Mock data with collections
  const stats = [
    {
      title: 'Total Revenue',
      value: '$12,450',
      change: '+12.5%',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Active Products',
      value: '24',
      change: '+3',
      icon: Package,
      color: 'text-blue-600'
    },
    {
      title: 'Product Collections',
      value: '6',
      change: '+2',
      icon: Layers,
      color: 'text-purple-600'
    },
    {
      title: 'Link Performance',
      value: '3.2%',
      change: '+0.8%',
      icon: TrendingUp,
      color: 'text-orange-600'
    }
  ];

  const products = [
    {
      id: 1,
      name: 'Wireless Bluetooth Headphones',
      price: 79.99,
      stock: 45,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop',
      views: 1250,
      collection: 'Electronics Collection',
      lowStock: false
    },
    {
      id: 2,
      name: 'Smart Fitness Watch',
      price: 199.99,
      stock: 3,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop',
      views: 890,
      collection: 'Electronics Collection',
      lowStock: true
    },
    {
      id: 3,
      name: 'Premium Coffee Beans (1kg)',
      price: 24.99,
      stock: 0,
      status: 'inactive',
      image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=200&fit=crop',
      views: 456,
      collection: null,
      lowStock: false
    },
    {
      id: 4,
      name: 'Organic Face Moisturizer',
      price: 34.99,
      stock: 28,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=300&h=200&fit=crop',
      views: 723,
      collection: 'Beauty Collection',
      lowStock: false
    }
  ];

  const collections = [
    { id: 1, name: 'Electronics Collection', productCount: 2, views: 2140 },
    { id: 2, name: 'Beauty Collection', productCount: 1, views: 723 },
    { id: 3, name: 'Summer Essentials', productCount: 0, views: 0 }
  ];

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleProductSelection = (productId: number) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const copyProductLink = (productId: number) => {
    const url = `https://quickvendor.com/p/vendor123/product-${productId}`;
    navigator.clipboard.writeText(url);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600 mt-1">Manage your products and collections</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={onManageCollections}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <Layers className="w-4 h-4" />
            <span>Manage Collections</span>
          </Button>
          <Button
            onClick={onCreateProduct}
            className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Product</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className={`text-sm font-medium mt-1 ${stat.color}`}>
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm cursor-pointer hover:shadow-xl transition-shadow" onClick={onManageCollections}>
          <CardContent className="p-6 text-center">
            <Layers className="w-12 h-12 mx-auto text-purple-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Manage Collections</h3>
            <p className="text-gray-600">Create and organize product groups</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm cursor-pointer hover:shadow-xl transition-shadow" onClick={onViewAnalytics}>
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-12 h-12 mx-auto text-orange-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">View Analytics</h3>
            <p className="text-gray-600">Track performance metrics</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm cursor-pointer hover:shadow-xl transition-shadow" onClick={onManageLinks}>
          <CardContent className="p-6 text-center">
            <Link className="w-12 h-12 mx-auto text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Link Management</h3>
            <p className="text-gray-600">Manage shareable URLs</p>
          </CardContent>
        </Card>
      </div>

      {/* Collections Overview */}
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Layers className="w-5 h-5" />
            <span>Product Collections</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {collections.map((collection) => (
              <div key={collection.id} className="p-4 border rounded-lg hover:border-blue-300 transition-colors">
                <h4 className="font-semibold">{collection.name}</h4>
                <p className="text-sm text-gray-600 mt-1">
                  {collection.productCount} products • {collection.views} views
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  Manage
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Product Management */}
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <CardTitle className="flex items-center space-x-2">
              <Package className="w-5 h-5" />
              <span>Product Inventory</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full md:w-64"
                />
              </div>
              {selectedProducts.length > 0 && (
                <Button variant="outline" size="sm">
                  Create Collection ({selectedProducts.length})
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6 p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => toggleProductSelection(product.id)}
                    className="w-4 h-4"
                  />
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-semibold text-gray-900">{product.name}</h3>
                    <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                      {product.status}
                    </Badge>
                    {product.lowStock && (
                      <Badge className="bg-orange-100 text-orange-800 flex items-center space-x-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Low Stock</span>
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <span className="font-semibold text-green-600">${product.price}</span>
                    <span className="flex items-center space-x-1">
                      <Package className="w-4 h-4" />
                      <span>{product.stock} in stock</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{product.views} views</span>
                    </span>
                    {product.collection && (
                      <Badge variant="outline" className="text-purple-600">
                        {product.collection}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewProduct(product)}
                    className="flex items-center space-x-1"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-1"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyProductLink(product.id)}
                    className="flex items-center space-x-1"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy Link</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorDashboard;
