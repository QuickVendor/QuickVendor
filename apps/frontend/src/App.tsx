
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';

// Pages
import Index from '@/pages/Index';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardHome from '@/pages/DashboardHome';
import ProductsManagerPage from '@/pages/ProductsManagerPage';
import CollectionsManagerPage from '@/pages/CollectionsManagerPage';
import ProfilePage from '@/pages/ProfilePage';
import ProductListingPage from '@/pages/ProductListingPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import CollectionPage from '@/pages/CollectionPage';
import PurchasePage from '@/pages/PurchasePage';
import SuccessPage from '@/pages/SuccessPage';
import NotFoundPage from '@/pages/NotFoundPage';

import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/success" element={<SuccessPage />} />
            
            {/* Vendor public pages */}
            <Route path="/:vendorSlug" element={<ProductListingPage />} />
            <Route path="/:vendorSlug/product/:productId" element={<ProductDetailPage />} />
            <Route path="/:vendorSlug/collection/:collectionId" element={<CollectionPage />} />
            <Route path="/:vendorSlug/purchase/:productId" element={<PurchasePage />} />
            
            {/* Protected dashboard routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<DashboardHome />} />
              <Route path="products" element={<ProductsManagerPage />} />
              <Route path="collections" element={<CollectionsManagerPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
            
            {/* 404 page */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
