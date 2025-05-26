
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Save } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const GroundManagement = () => {
  const [grounds, setGrounds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingGround, setEditingGround] = useState<any>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  // Form state for both add and edit
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    address: '',
    price_per_hour: '',
    description: '',
    image_url: '',
    latitude: '',
    longitude: ''
  });

  useEffect(() => {
    fetchGrounds();
  }, []);

  const fetchGrounds = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('grounds')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching grounds:', error);
        toast({
          title: "Error",
          description: "Failed to fetch grounds.",
          variant: "destructive",
        });
      } else {
        setGrounds(data || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      address: '',
      price_per_hour: '',
      description: '',
      image_url: '',
      latitude: '',
      longitude: ''
    });
  };

  const handleAddGround = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.location || !formData.address || !formData.price_per_hour) {
      toast({
        title: "Error",
        description: "Name, location, address, and price per hour are required.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const groundData = {
        name: formData.name,
        location: formData.location,
        address: formData.address,
        price_per_hour: Number(formData.price_per_hour),
        description: formData.description || '',
        image_url: formData.image_url || '',
        latitude: formData.latitude ? Number(formData.latitude) : 0,
        longitude: formData.longitude ? Number(formData.longitude) : 0,
        owner_id: user?.id || ''
      };

      const { error } = await supabase.from('grounds').insert(groundData);

      if (error) {
        console.error('Error adding ground:', error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Ground added successfully!",
        });
        resetForm();
        setIsAddDialogOpen(false);
        fetchGrounds();
      }
    } catch (error) {
      console.error('Error adding ground:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const handleEditGround = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.location || !formData.address || !formData.price_per_hour) {
      toast({
        title: "Error",
        description: "Name, location, address, and price per hour are required.",
        variant: "destructive",
      });
      return;
    }

    try {
      const updateData = {
        name: formData.name,
        location: formData.location,
        address: formData.address,
        price_per_hour: Number(formData.price_per_hour),
        description: formData.description || '',
        image_url: formData.image_url || '',
        latitude: formData.latitude ? Number(formData.latitude) : editingGround.latitude || 0,
        longitude: formData.longitude ? Number(formData.longitude) : editingGround.longitude || 0
      };

      const { error } = await supabase
        .from('grounds')
        .update(updateData)
        .eq('id', editingGround.id);

      if (error) {
        console.error('Error updating ground:', error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Ground updated successfully!",
        });
        setIsEditDialogOpen(false);
        setEditingGround(null);
        resetForm();
        fetchGrounds();
      }
    } catch (error) {
      console.error('Error updating ground:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (ground: any) => {
    setEditingGround(ground);
    setFormData({
      name: ground.name,
      location: ground.location,
      address: ground.address,
      price_per_hour: ground.price_per_hour.toString(),
      description: ground.description || '',
      image_url: ground.image_url || '',
      latitude: ground.latitude?.toString() || '',
      longitude: ground.longitude?.toString() || ''
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteGround = async (groundId: string) => {
    if (!confirm('Are you sure you want to delete this ground?')) return;

    try {
      const { error } = await supabase
        .from('grounds')
        .delete()
        .eq('id', groundId);

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Ground deleted successfully!",
        });
        fetchGrounds();
      }
    } catch (error) {
      console.error('Error deleting ground:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const GroundForm = ({ onSubmit, title }: { onSubmit: (e: React.FormEvent) => void, title: string }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Ground Name *</Label>
          <Input 
            id="name"
            value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})} 
            placeholder="Enter ground name" 
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <Input 
            id="location"
            value={formData.location} 
            onChange={e => setFormData({...formData, location: e.target.value})} 
            placeholder="Enter location" 
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">Address *</Label>
        <Input 
          id="address"
          value={formData.address} 
          onChange={e => setFormData({...formData, address: e.target.value})} 
          placeholder="Enter full address" 
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price Per Hour (₹) *</Label>
          <Input 
            id="price"
            type="number" 
            min="0" 
            value={formData.price_per_hour} 
            onChange={e => setFormData({...formData, price_per_hour: e.target.value})} 
            placeholder="0" 
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="image">Image URL</Label>
          <Input 
            id="image"
            value={formData.image_url} 
            onChange={e => setFormData({...formData, image_url: e.target.value})} 
            placeholder="Enter image URL (optional)" 
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="latitude">Latitude</Label>
          <Input 
            id="latitude"
            type="number" 
            step="any"
            value={formData.latitude} 
            onChange={e => setFormData({...formData, latitude: e.target.value})} 
            placeholder="0.0" 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="longitude">Longitude</Label>
          <Input 
            id="longitude"
            type="number" 
            step="any"
            value={formData.longitude} 
            onChange={e => setFormData({...formData, longitude: e.target.value})} 
            placeholder="0.0" 
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description"
          value={formData.description} 
          onChange={e => setFormData({...formData, description: e.target.value})} 
          placeholder="Enter ground description (optional)" 
          rows={3}
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
          <Save className="h-4 w-4 mr-2" />
          {title}
        </Button>
      </div>
    </form>
  );

  if (loading) {
    return <div className="text-center py-8">Loading grounds...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Ground Management</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-600 hover:bg-amber-700" onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Ground
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Cricket Ground</DialogTitle>
            </DialogHeader>
            <GroundForm onSubmit={handleAddGround} title="Add Ground" />
          </DialogContent>
        </Dialog>
      </div>

      {grounds.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No grounds found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {grounds.map((ground) => (
            <Card key={ground.id} className="overflow-hidden">
              <div className="aspect-video w-full">
                <img
                  src={ground.image_url || '/cric.jpg'}
                  alt={ground.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{ground.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{ground.location}</p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold">₹{ground.price_per_hour}/hr</span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => openEditDialog(ground)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDeleteGround(ground.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Ground</DialogTitle>
          </DialogHeader>
          <GroundForm onSubmit={handleEditGround} title="Update Ground" />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GroundManagement;
