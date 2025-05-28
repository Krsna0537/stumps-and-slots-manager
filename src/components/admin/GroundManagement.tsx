
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Save, AlertCircle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Ground {
  id: string;
  name: string;
  location: string;
  address: string;
  price_per_hour: number;
  description: string | null;
  image_url: string | null;
  latitude: number | null;
  longitude: number | null;
  owner_id: string | null;
  is_featured: boolean | null;
  created_at: string;
  updated_at: string;
}

const GroundManagement = () => {
  const [grounds, setGrounds] = useState<Ground[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingGround, setEditingGround] = useState<Ground | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
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
      console.log('Fetching grounds...');
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
        console.log('Grounds fetched successfully:', data);
        setGrounds(data || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while fetching grounds.",
        variant: "destructive",
      });
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
    setFormErrors({});
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Ground name is required';
    }
    
    if (!formData.location.trim()) {
      errors.location = 'Location is required';
    }
    
    if (!formData.address.trim()) {
      errors.address = 'Address is required';
    }
    
    if (!formData.price_per_hour || Number(formData.price_per_hour) <= 0) {
      errors.price_per_hour = 'Price per hour must be greater than 0';
    }

    if (formData.latitude && isNaN(Number(formData.latitude))) {
      errors.latitude = 'Latitude must be a valid number';
    }

    if (formData.longitude && isNaN(Number(formData.longitude))) {
      errors.longitude = 'Longitude must be a valid number';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddGround = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) {
      console.log('Already submitting, ignoring duplicate submission');
      return;
    }

    console.log('Starting ground addition with form data:', formData);
    
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    setIsSubmitting(true);

    try {
      const groundData = {
        name: formData.name.trim(),
        location: formData.location.trim(),
        address: formData.address.trim(),
        price_per_hour: Number(formData.price_per_hour),
        description: formData.description.trim() || null,
        image_url: formData.image_url.trim() || null,
        latitude: formData.latitude ? Number(formData.latitude) : null,
        longitude: formData.longitude ? Number(formData.longitude) : null,
        owner_id: 'bdd48058-64a2-4974-8d3e-57bc527cd931'
      };

      console.log('Inserting ground data:', groundData);

      const { data: insertedData, error } = await supabase
        .from('grounds')
        .insert(groundData)
        .select()
        .single();

      if (error) {
        console.error('Error adding ground:', error);
        toast({
          title: "Error",
          description: `Failed to add ground: ${error.message}`,
          variant: "destructive",
        });
      } else {
        console.log('Ground added successfully:', insertedData);
        toast({
          title: "Success",
          description: "Ground added successfully!",
        });
        resetForm();
        setIsAddDialogOpen(false);
        fetchGrounds();
      }
    } catch (error) {
      console.error('Unexpected error adding ground:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while adding the ground.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditGround = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting || !editingGround) {
      console.log('Already submitting or no ground selected, ignoring submission');
      return;
    }

    console.log('Starting ground update with form data:', formData);
    
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    setIsSubmitting(true);

    try {
      const updateData = {
        name: formData.name.trim(),
        location: formData.location.trim(),
        address: formData.address.trim(),
        price_per_hour: Number(formData.price_per_hour),
        description: formData.description.trim() || null,
        image_url: formData.image_url.trim() || null,
        latitude: formData.latitude ? Number(formData.latitude) : null,
        longitude: formData.longitude ? Number(formData.longitude) : null
      };

      console.log('Updating ground with data:', updateData);

      const { error } = await supabase
        .from('grounds')
        .update(updateData)
        .eq('id', editingGround.id);

      if (error) {
        console.error('Error updating ground:', error);
        toast({
          title: "Error",
          description: `Failed to update ground: ${error.message}`,
          variant: "destructive",
        });
      } else {
        console.log('Ground updated successfully');
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
        description: "An unexpected error occurred while updating the ground.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditDialog = (ground: Ground) => {
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
    setFormErrors({});
    setIsEditDialogOpen(true);
  };

  const handleDeleteGround = async (groundId: string) => {
    if (!confirm('Are you sure you want to delete this ground? This action cannot be undone.')) return;

    try {
      console.log('Deleting ground:', groundId);
      const { error } = await supabase
        .from('grounds')
        .delete()
        .eq('id', groundId);

      if (error) {
        console.error('Error deleting ground:', error);
        toast({
          title: "Error",
          description: `Failed to delete ground: ${error.message}`,
          variant: "destructive",
        });
      } else {
        console.log('Ground deleted successfully');
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
        description: "An unexpected error occurred while deleting the ground.",
        variant: "destructive",
      });
    }
  };

  const GroundForm = ({ onSubmit, title }: { onSubmit: (e: React.FormEvent) => void, title: string }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      {Object.keys(formErrors).length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please fix the following errors:
            <ul className="list-disc list-inside mt-2">
              {Object.entries(formErrors).map(([field, error]) => (
                <li key={field}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Ground Name *</Label>
          <Input 
            id="name"
            value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})} 
            placeholder="Enter ground name" 
            required
            disabled={isSubmitting}
            className={formErrors.name ? 'border-red-500' : ''}
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
            disabled={isSubmitting}
            className={formErrors.location ? 'border-red-500' : ''}
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
          disabled={isSubmitting}
          className={formErrors.address ? 'border-red-500' : ''}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price Per Hour (₹) *</Label>
          <Input 
            id="price"
            type="number" 
            min="1" 
            step="0.01"
            value={formData.price_per_hour} 
            onChange={e => setFormData({...formData, price_per_hour: e.target.value})} 
            placeholder="0" 
            required
            disabled={isSubmitting}
            className={formErrors.price_per_hour ? 'border-red-500' : ''}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="image">Image URL</Label>
          <Input 
            id="image"
            type="url"
            value={formData.image_url} 
            onChange={e => setFormData({...formData, image_url: e.target.value})} 
            placeholder="Enter image URL (optional)" 
            disabled={isSubmitting}
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
            disabled={isSubmitting}
            className={formErrors.latitude ? 'border-red-500' : ''}
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
            disabled={isSubmitting}
            className={formErrors.longitude ? 'border-red-500' : ''}
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
          disabled={isSubmitting}
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button 
          type="submit" 
          className="bg-amber-600 hover:bg-amber-700"
          disabled={isSubmitting}
        >
          <Save className="h-4 w-4 mr-2" />
          {isSubmitting ? 'Saving...' : title}
        </Button>
      </div>
    </form>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading grounds...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Ground Management</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-amber-600 hover:bg-amber-700">
              <Plus className="h-4 w-4 mr-2" />
              Add New Ground
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Cricket Ground</DialogTitle>
            </DialogHeader>
            <GroundForm onSubmit={handleAddGround} title="Add Ground" />
          </DialogContent>
        </Dialog>
      </div>

      {grounds.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Plus className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No grounds found</h3>
            <p className="text-muted-foreground mb-4">Get started by adding your first cricket ground.</p>
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-amber-600 hover:bg-amber-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add First Ground
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {grounds.map((ground) => (
            <Card key={ground.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video w-full">
                <img
                  src={ground.image_url || '/cric.jpg'}
                  alt={ground.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/cric.jpg';
                  }}
                />
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg line-clamp-1">{ground.name}</CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-1">{ground.location}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">{ground.address}</p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold text-lg text-green-600">
                    ₹{ground.price_per_hour}/hr
                  </span>
                  {ground.is_featured && (
                    <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
                      Featured
                    </span>
                  )}
                </div>
                {ground.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {ground.description}
                  </p>
                )}
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
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        setIsEditDialogOpen(open);
        if (!open) {
          setEditingGround(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
