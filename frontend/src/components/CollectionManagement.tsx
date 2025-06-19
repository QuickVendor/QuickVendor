import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Plus, 
  Layers, 
  Copy, 
  Edit, 
  Trash2, 
  GripVertical,
  Check,
  Share,
  MoreVertical
} from 'lucide-react';
import { toast } from 'sonner';

interface CollectionManagementProps {
  onBack: () => void;
}

const CollectionManagement = ({ onBack }: CollectionManagementProps) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCollection, setNewCollection] = useState({
    name: '',
    description: ''
  });
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

  // Mock data
  const collections = [
    {
      id: 1,
      name: 'Electronics Collection',
      description: 'Latest tech gadgets and accessories',
      products: [
        { id: 1, name: 'Wireless Headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop' },
        { id: 2, name: 'Smart Watch', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop' }
      ],
      views: 2140,
      url: 'https://quickvendor.com/c/vendor123/electronics-collection'
    },
    {
      id: 2,
      name: 'Beauty Collection',
      description: 'Organic skincare and beauty products',
      products: [
        { id: 4, name: 'Face Moisturizer', image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=100&h=100&fit=crop' }
      ],
      views: 723,
      url: 'https://quickvendor.com/c/vendor123/beauty-collection'
    }
  ];

  const availableProducts = [
    { id: 3, name: 'Premium Coffee Beans', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=100&h=100&fit=crop' }
  ];

  const handleCreateCollection = () => {
    if (!newCollection.name.trim()) {
      toast.error('Collection name is required');
      return;
    }
    
    const url = `https://quickvendor.com/c/vendor123/${newCollection.name.toLowerCase().replace(/\s+/g, '-')}`;
    toast.success('Collection created successfully!');
    setShowCreateForm(false);
    setNewCollection({ name: '', description: '' });
  };

  const copyCollectionUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('Collection URL copied to clipboard!');
  };

  const toggleProductSelection = (productId: number) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-6xl mx-auto p-3 sm:p-4 lg:p-6 space-y-6">
        {/* Mobile-Optimized Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={onBack} 
              className="flex items-center space-x-2 p-2 sm:px-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Dashboard</span>
            </Button>
            
            {/* Mobile Create Button */}
            <Button 
              onClick={() => setShowCreateForm(true)}
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold sm:hidden"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Collection Management</h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">Create and manage product collections</p>
            </div>
            
            {/* Desktop Create Button */}
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold hidden sm:flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Create Collection</span>
            </Button>
          </div>
        </div>

        {/* Create Collection Form */}
        {showCreateForm && (
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                <Layers className="w-5 h-5" />
                <span>Create New Collection</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium">Collection Name</Label>
                  <Input
                    id="name"
                    value={newCollection.name}
                    onChange={(e) => setNewCollection(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter collection name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Generated URL</Label>
                  <Input
                    value={`quickvendor.com/c/vendor123/${newCollection.name.toLowerCase().replace(/\s+/g, '-') || 'collection-name'}`}
                    readOnly
                    className="bg-gray-100 mt-1 text-xs sm:text-sm"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                <Textarea
                  id="description"
                  value={newCollection.description}
                  onChange={(e) => setNewCollection(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your collection..."
                  rows={3}
                  className="mt-1"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
                <Button onClick={handleCreateCollection} className="w-full sm:w-auto">
                  Create Collection
                </Button>
                <Button variant="outline" onClick={() => setShowCreateForm(false)} className="w-full sm:w-auto">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Existing Collections */}
        <div className="space-y-4 sm:space-y-6">
          {collections.map((collection) => (
            <Card key={collection.id} className="border-0 shadow-lg bg-white/70 backdrop-blur-sm overflow-hidden">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="space-y-3">
                  {/* Collection Header - Mobile Stacked */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                        <Layers className="w-5 h-5 flex-shrink-0" />
                        <span className="truncate">{collection.name}</span>
                      </CardTitle>
                      <p className="text-gray-600 mt-1 text-sm sm:text-base leading-relaxed">{collection.description}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">{collection.products.length} products</Badge>
                        <Badge variant="outline" className="text-xs">{collection.views} views</Badge>
                      </div>
                    </div>
                    
                    {/* Action Buttons - Mobile Optimized */}
                    <div className="flex flex-wrap sm:flex-nowrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyCollectionUrl(collection.url)}
                        className="flex items-center space-x-1 text-xs sm:text-sm flex-1 sm:flex-none min-w-0"
                      >
                        <Copy className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="hidden sm:inline">Copy Link</span>
                        <span className="sm:hidden">Copy</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-1 text-xs sm:text-sm flex-1 sm:flex-none min-w-0"
                      >
                        <Share className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="hidden sm:inline">Share</span>
                        <span className="sm:hidden">Share</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="hidden sm:flex items-center space-x-1 text-xs sm:text-sm"
                      >
                        <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Edit</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="hidden sm:flex items-center space-x-1 text-xs sm:text-sm text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Delete</span>
                      </Button>
                      
                      {/* Mobile More Menu */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="sm:hidden flex items-center justify-center w-9 h-9"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4 sm:space-y-6">
                {/* Products in Collection */}
                <div>
                  <h4 className="font-semibold mb-3 text-sm sm:text-base">Products in this Collection</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                    {collection.products.map((product) => (
                      <div key={product.id} className="relative group">
                        <div className="flex items-center justify-center p-1 bg-gray-100 rounded mb-2">
                          <GripVertical className="w-3 h-3 text-gray-400" />
                        </div>
                        <div className="relative">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-16 sm:h-20 object-cover rounded-lg border-2 border-gray-200"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute -top-1 -right-1 w-6 h-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                        <p className="text-xs mt-2 text-center truncate leading-tight">{product.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Add Products to Collection */}
                <div>
                  <h4 className="font-semibold mb-3 text-sm sm:text-base">Add Products to Collection</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                    {availableProducts.map((product) => (
                      <div 
                        key={product.id} 
                        className="relative cursor-pointer hover:scale-105 transition-transform active:scale-95"
                        onClick={() => toggleProductSelection(product.id)}
                      >
                        <div className="relative">
                          <img
                            src={product.image}
                            alt={product.name}
                            className={`w-full h-16 sm:h-20 object-cover rounded-lg border-2 transition-colors ${
                              selectedProducts.includes(product.id) 
                                ? 'border-blue-500' 
                                : 'border-gray-200'
                            }`}
                          />
                          {selectedProducts.includes(product.id) && (
                            <div className="absolute top-1 right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        <p className="text-xs mt-2 text-center truncate leading-tight">{product.name}</p>
                      </div>
                    ))}
                  </div>
                  
                  {selectedProducts.length > 0 && (
                    <div className="mt-4">
                      <Button 
                        onClick={() => {
                          toast.success(`Added ${selectedProducts.length} product(s) to collection`);
                          setSelectedProducts([]);
                        }}
                        className="w-full sm:w-auto flex items-center justify-center space-x-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add {selectedProducts.length} Product{selectedProducts.length > 1 ? 's' : ''}</span>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollectionManagement;
