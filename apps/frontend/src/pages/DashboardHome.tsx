
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import DashboardStats from '@/components/DashboardStats';
import TransactionLog from '@/components/TransactionLog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LoadingState from '@/components/LoadingState';

const DashboardHome = () => {
  const { user } = useAuth();
  const [vendorData, setVendorData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVendorData();
  }, [user]);

  const fetchVendorData = async () => {
    if (!user) return;

    try {
      const { data: vendor } = await supabase
        .from('vendors')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setVendorData(vendor);
    } catch (error) {
      console.error('Error fetching vendor data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading dashboard..." />;
  }

  if (!vendorData) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome! Setting up your vendor profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {vendorData.business_name}! Here's what's happening with your store.
        </p>
      </div>

      <DashboardStats vendorId={vendorData.id} />

      <div className="grid gap-4 md:grid-cols-2">
        <TransactionLog />
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks to manage your store
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm">
              <a href="/dashboard/products" className="text-indigo-600 hover:text-indigo-800">
                → Add new product
              </a>
            </div>
            <div className="text-sm">
              <a href="/dashboard/collections" className="text-indigo-600 hover:text-indigo-800">
                → Create collection
              </a>
            </div>
            <div className="text-sm">
              <a href="/dashboard/profile" className="text-indigo-600 hover:text-indigo-800">
                → Update profile
              </a>
            </div>
            <div className="text-sm">
              <a href={`/${vendorData.slug}`} target="_blank" className="text-indigo-600 hover:text-indigo-800">
                → View your public store
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardHome;
