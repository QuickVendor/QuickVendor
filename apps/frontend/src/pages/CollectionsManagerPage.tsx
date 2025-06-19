
import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Collection {
  id: string;
  name: string;
  description: string | null;
  vendor_id: string;
  created_at: string;
  updated_at: string;
}

const CollectionsManagerPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [vendorId, setVendorId] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchVendorAndCollections();
  }, [user]);

  const fetchVendorAndCollections = async () => {
    if (!user) return;

    try {
      // Get vendor data
      const { data: vendor } = await supabase
        .from('vendors')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (vendor) {
        setVendorId(vendor.id);
        await fetchCollections(vendor.id);
      }
    } catch (error) {
      console.error('Error fetching vendor data:', error);
    }
  };

  const fetchCollections = async (vendorId: string) => {
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .eq('vendor_id', vendorId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching collections:', error);
      return;
    }

    setCollections(data || []);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: ''
    });
    setEditingCollection(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (collection: Collection) => {
    setFormData({
      name: collection.name,
      description: collection.description || ''
    });
    setEditingCollection(collection);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorId || !formData.name.trim()) return;

    try {
      const collectionData = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        vendor_id: vendorId
      };

      if (editingCollection) {
        const { error } = await supabase
          .from('collections')
          .update(collectionData)
          .eq('id', editingCollection.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Collection updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('collections')
          .insert([collectionData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Collection created successfully",
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchCollections(vendorId);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (collectionId: string) => {
    if (!window.confirm('Are you sure you want to delete this collection? Products in this collection will not be deleted, but will be uncategorized.')) return;

    try {
      const { error } = await supabase
        .from('collections')
        .delete()
        .eq('id', collectionId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Collection deleted successfully",
      });

      fetchCollections(vendorId);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const isFormValid = formData.name.trim().length > 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Collections</h1>
          <p className="text-muted-foreground">
            Organize your products into collections
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add Collection
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingCollection ? 'Edit Collection' : 'Create New Collection'}
              </DialogTitle>
              <DialogDescription>
                {editingCollection ? 'Update your collection details below.' : 'Create a new collection to organize your products.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Collection Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter collection name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe this collection"
                  rows={3}
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!isFormValid}
                  className="flex-1"
                >
                  {editingCollection ? 'Update' : 'Create'} Collection
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {collections.map((collection) => (
          <Card key={collection.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                {collection.name}
              </CardTitle>
              {collection.description && (
                <CardDescription>{collection.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEditDialog(collection)}
                  className="flex-1"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(collection.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {collections.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FolderOpen className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No collections yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Create collections to organize your products into categories.
              </p>
              <Button onClick={openCreateDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Collection
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CollectionsManagerPage;
