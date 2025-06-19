import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, X, Copy, Check, Layers, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface ProductCreationFormProps {
  onProductCreated: () => void;
}

const ProductCreationForm = ({ onProductCreated }: ProductCreationFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    inventory: '',
    isActive: true,
    collection: ''
  });
  const [images, setImages] = useState<string[]>([]);
  const [generatedUrls, setGeneratedUrls] = useState({
    product: '',
    collection: ''
  });
  const [urlsCopied, setUrlsCopied] = useState({
    product: false,
    collection: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showNewCollection, setShowNewCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');

  const categories = [
    'Electronics',
    'Clothing & Fashion',
    'Home & Garden',
    'Sports & Outdoors',
    'Books & Media',
    'Health & Beauty',
    'Toys & Games',
    'Automotive',
    'Other'
  ];

  const existingCollections = [
    'Electronics Collection',
    'Beauty Collection',
    'Summer Essentials',
    'Holiday Specials'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Product name must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Product description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.inventory) {
      newErrors.inventory = 'Inventory quantity is required';
    } else if (parseInt(formData.inventory) < 0) {
      newErrors.inventory = 'Inventory cannot be negative';
    }

    if (images.length === 0) {
      newErrors.images = 'At least one product image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (images.length + files.length > 10) {
      toast.error('Maximum 10 images allowed');
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImages(prev => [...prev, e.target.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });

    if (errors.images) {
      setErrors(prev => ({ ...prev, images: '' }));
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    // Generate URLs
    const productId = Math.random().toString(36).substr(2, 9);
    const productUrl = `https://quickvendor.com/p/vendor123/${formData.name.toLowerCase().replace(/\s+/g, '-')}-${productId}`;
    
    let collectionUrl = '';
    if (formData.collection || newCollectionName) {
      const collectionName = newCollectionName || formData.collection;
      collectionUrl = `https://quickvendor.com/c/vendor123/${collectionName.toLowerCase().replace(/\s+/g, '-')}`;
    }
    
    setGeneratedUrls({
      product: productUrl,
      collection: collectionUrl
    });
    
    toast.success('Product created successfully!');
  };

  const copyUrl = (type: 'product' | 'collection') => {
    const url = generatedUrls[type];
    navigator.clipboard.writeText(url);
    setUrlsCopied(prev => ({ ...prev, [type]: true }));
    toast.success(`${type === 'product' ? 'Product' : 'Collection'} URL copied to clipboard!`);
    setTimeout(() => setUrlsCopied(prev => ({ ...prev, [type]: false })), 2000);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Create New Product
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Images */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">Product Images</Label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
                
                {images.length < 10 && (
                  <label className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500 text-center">
                      Upload Image
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              {errors.images && <p className="text-red-500 text-sm">{errors.images}</p>}
              <p className="text-sm text-gray-600">{images.length}/10 images uploaded</p>
            </div>

            {/* Product Details */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter product name"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="0.00"
                    className={errors.price ? 'border-red-500' : ''}
                  />
                  {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="inventory">Inventory Quantity</Label>
                  <Input
                    id="inventory"
                    type="number"
                    value={formData.inventory}
                    onChange={(e) => handleInputChange('inventory', e.target.value)}
                    placeholder="0"
                    className={errors.inventory ? 'border-red-500' : ''}
                  />
                  {errors.inventory && <p className="text-red-500 text-sm mt-1">{errors.inventory}</p>}
                </div>

                <div className="flex items-center space-x-3">
                  <Switch
                    id="active"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                  />
                  <Label htmlFor="active" className="font-medium">
                    Product Active
                  </Label>
                  <Badge variant={formData.isActive ? 'default' : 'secondary'}>
                    {formData.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                {/* Collection Selection */}
                <div>
                  <Label className="flex items-center space-x-2">
                    <Layers className="w-4 h-4" />
                    <span>Add to Collection (Optional)</span>
                  </Label>
                  <div className="mt-2 space-y-2">
                    <Select 
                      value={formData.collection} 
                      onValueChange={(value) => {
                        if (value === 'new') {
                          setShowNewCollection(true);
                          handleInputChange('collection', '');
                        } else {
                          setShowNewCollection(false);
                          handleInputChange('collection', value);
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select existing collection" />
                      </SelectTrigger>
                      <SelectContent>
                        {existingCollections.map((collection) => (
                          <SelectItem key={collection} value={collection}>
                            {collection}
                          </SelectItem>
                        ))}
                        <SelectItem value="new">
                          <div className="flex items-center space-x-2">
                            <Plus className="w-4 h-4" />
                            <span>Create New Collection</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    
                    {showNewCollection && (
                      <Input
                        value={newCollectionName}
                        onChange={(e) => setNewCollectionName(e.target.value)}
                        placeholder="Enter new collection name"
                        className="mt-2"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Product Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your product in detail..."
                rows={6}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold py-3"
            >
              Create Product & Generate Links
            </Button>
          </form>

          {/* Generated URLs */}
          {generatedUrls.product && (
            <div className="space-y-4">
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-green-800 mb-3">✨ Product Created Successfully!</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-green-800">Single Product Link:</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Input
                          value={generatedUrls.product}
                          readOnly
                          className="flex-1 bg-white text-sm"
                        />
                        <Button
                          type="button"
                          onClick={() => copyUrl('product')}
                          className="flex items-center space-x-2"
                        >
                          {urlsCopied.product ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          <span>{urlsCopied.product ? 'Copied!' : 'Copy'}</span>
                        </Button>
                      </div>
                    </div>
                    
                    {generatedUrls.collection && (
                      <div>
                        <Label className="text-sm font-medium text-green-800">Collection Link:</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Input
                            value={generatedUrls.collection}
                            readOnly
                            className="flex-1 bg-white text-sm"
                          />
                          <Button
                            type="button"
                            onClick={() => copyUrl('collection')}
                            className="flex items-center space-x-2"
                          >
                            {urlsCopied.collection ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            <span>{urlsCopied.collection ? 'Copied!' : 'Copy'}</span>
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-green-700 mt-3">
                    Share these links on social media to start selling!
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductCreationForm;
