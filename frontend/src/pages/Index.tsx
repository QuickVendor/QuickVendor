import { useState } from 'react';
import ProductCreationForm from '@/components/ProductCreationForm';
import VendorDashboard from '@/components/VendorDashboard';
import SingleProductView from '@/components/SingleProductView';
import CollectionManagement from '@/components/CollectionManagement';
import CollectionAnalytics from '@/components/CollectionAnalytics';
import LinkManagement from '@/components/LinkManagement';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Plus, BarChart3, Package, Link, Layers, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { user, signOut } = useAuth();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'create-product':
        return <ProductCreationForm onProductCreated={() => setCurrentView('dashboard')} />;
      case 'product-view':
        return <SingleProductView product={selectedProduct} onBack={() => setCurrentView('dashboard')} />;
      case 'collections':
        return <CollectionManagement onBack={() => setCurrentView('dashboard')} />;
      case 'analytics':
        return <CollectionAnalytics onBack={() => setCurrentView('dashboard')} />;
      case 'links':
        return <LinkManagement onBack={() => setCurrentView('dashboard')} />;
      default:
        return <VendorDashboard 
          onCreateProduct={() => setCurrentView('create-product')}
          onViewProduct={(product) => {
            setSelectedProduct(product);
            setCurrentView('product-view');
          }}
          onManageCollections={() => setCurrentView('collections')}
          onViewAnalytics={() => setCurrentView('analytics')}
          onManageLinks={() => setCurrentView('links')}
        />;
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header Navigation */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  Quick Vendor
                </h1>
                {user?.user_metadata?.vendor_name && (
                  <p className="text-xs text-gray-600">Welcome, {user.user_metadata.vendor_name}</p>
                )}
              </div>
            </div>
            
            <nav className="hidden md:flex items-center space-x-2">
              <Button
                variant={currentView === 'dashboard' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('dashboard')}
                className="flex items-center space-x-2"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Dashboard</span>
              </Button>
              <Button
                variant={currentView === 'create-product' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('create-product')}
                className="flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create Product</span>
              </Button>
              <Button
                variant={currentView === 'collections' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('collections')}
                className="flex items-center space-x-2"
              >
                <Layers className="w-4 h-4" />
                <span>Collections</span>
              </Button>
              <Button
                variant={currentView === 'analytics' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('analytics')}
                className="flex items-center space-x-2"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Analytics</span>
              </Button>
              <Button
                variant={currentView === 'links' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('links')}
                className="flex items-center space-x-2"
              >
                <Link className="w-4 h-4" />
                <span>Links</span>
              </Button>
              
              <Button
                variant="ghost"
                onClick={handleSignOut}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </nav>

            <div className="md:hidden flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentView('create-product')}
                className="bg-gradient-to-r from-blue-600 to-green-600 text-white hover:from-blue-700 hover:to-green-700"
              >
                <Plus className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-20 md:pb-8">
        {renderCurrentView()}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 z-50">
        <div className="grid grid-cols-5 gap-1 p-2">
          <Button
            variant={currentView === 'dashboard' ? 'default' : 'ghost'}
            onClick={() => setCurrentView('dashboard')}
            className="flex flex-col items-center space-y-1 h-auto py-2"
          >
            <BarChart3 className="w-4 h-4" />
            <span className="text-xs">Dashboard</span>
          </Button>
          <Button
            variant={currentView === 'create-product' ? 'default' : 'ghost'}
            onClick={() => setCurrentView('create-product')}
            className="flex flex-col items-center space-y-1 h-auto py-2"
          >
            <Plus className="w-4 h-4" />
            <span className="text-xs">Create</span>
          </Button>
          <Button
            variant={currentView === 'collections' ? 'default' : 'ghost'}
            onClick={() => setCurrentView('collections')}
            className="flex flex-col items-center space-y-1 h-auto py-2"
          >
            <Layers className="w-4 h-4" />
            <span className="text-xs">Collections</span>
          </Button>
          <Button
            variant={currentView === 'analytics' ? 'default' : 'ghost'}
            onClick={() => setCurrentView('analytics')}
            className="flex flex-col items-center space-y-1 h-auto py-2"
          >
            <BarChart3 className="w-4 h-4" />
            <span className="text-xs">Analytics</span>
          </Button>
          <Button
            variant={currentView === 'links' ? 'default' : 'ghost'}
            onClick={() => setCurrentView('links')}
            className="flex flex-col items-center space-y-1 h-auto py-2"
          >
            <Link className="w-4 h-4" />
            <span className="text-xs">Links</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
