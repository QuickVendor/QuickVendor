
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, FolderOpen, TrendingUp, DollarSign, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardStatsProps {
  vendorId: string;
}

interface Stats {
  totalProducts: number;
  totalCollections: number;
  inStockProducts: number;
  totalValue: number;
  totalViews: number;
  totalTransactions: number;
  totalRevenue: number;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ vendorId }) => {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalCollections: 0,
    inStockProducts: 0,
    totalValue: 0,
    totalViews: 0,
    totalTransactions: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [vendorId]);

  const fetchStats = async () => {
    if (!vendorId) return;

    try {
      // Fetch basic product stats
      const { data: products } = await supabase
        .from('products')
        .select('price, in_stock')
        .eq('vendor_id', vendorId);

      // Fetch collections count
      const { data: collections } = await supabase
        .from('collections')
        .select('id')
        .eq('vendor_id', vendorId);

      // Fetch view analytics
      const { data: viewStats } = await supabase
        .from('product_views')
        .select('id')
        .eq('vendor_id', vendorId);

      // Fetch transaction analytics
      const { data: transactionStats } = await supabase
        .from('transaction_analytics')
        .select('*')
        .eq('vendor_id', vendorId)
        .single();

      const totalProducts = products?.length || 0;
      const inStockProducts = products?.filter(p => p.in_stock).length || 0;
      const totalValue = products?.reduce((sum, p) => sum + Number(p.price), 0) || 0;
      const totalViews = viewStats?.length || 0;

      setStats({
        totalProducts,
        totalCollections: collections?.length || 0,
        inStockProducts,
        totalValue,
        totalViews,
        totalTransactions: transactionStats?.total_transactions || 0,
        totalRevenue: Number(transactionStats?.total_revenue || 0)
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16 animate-pulse mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Products</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalProducts}</div>
          <p className="text-xs text-muted-foreground">
            {stats.inStockProducts} in stock
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Collections</CardTitle>
          <FolderOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalCollections}</div>
          <p className="text-xs text-muted-foreground">Categories</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalViews}</div>
          <p className="text-xs text-muted-foreground">Product views</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            {stats.totalTransactions} transactions
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
