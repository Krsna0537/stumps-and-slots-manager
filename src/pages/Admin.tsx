
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Shield, Plus, Trash2, Edit } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Admin = () => {
  const { user, userRole, loading } = useAuth('admin');
  const { toast } = useToast();

  // Form state
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [pricePerHour, setPricePerHour] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [addLoading, setAddLoading] = useState(false);

  // Data state
  const [grounds, setGrounds] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (userRole !== 'admin' || !user) return;
    
    const fetchData = async () => {
      setDataLoading(true);
      
      try {
        const [groundsResponse, bookingsResponse] = await Promise.all([
          supabase.from('grounds').select('*').order('created_at', { ascending: false }),
          supabase.from('bookings').select(`
            *,
            user_profiles:user_id (first_name, last_name),
            grounds:ground_id (name)
          `).order('created_at', { ascending: false })
        ]);
        
        if (groundsResponse.error) {
          console.error('Error fetching grounds:', groundsResponse.error);
        } else {
          setGrounds(groundsResponse.data || []);
        }

        if (bookingsResponse.error) {
          console.error('Error fetching bookings:', bookingsResponse.error);
        } else {
          setBookings(bookingsResponse.data || []);
        }
      } catch (error) {
        console.error('Unexpected error fetching data:', error);
      }
      
      setDataLoading(false);
    };
    
    fetchData();
  }, [userRole, user]);

  const handleAddGround = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !location || !address || !pricePerHour) {
      toast({
        title: "Error",
        description: "Name, location, address, and price per hour are required.",
        variant: "destructive",
      });
      return;
    }

    setAddLoading(true);
    
    try {
      const { error } = await supabase.from('grounds').insert({
        name,
        location,
        address,
        price_per_hour: Number(pricePerHour),
        description,
        image_url: imageUrl || null,
        owner_id: user.id
      });

      if (error) {
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
        
        // Reset form
        setName('');
        setLocation('');
        setAddress('');
        setPricePerHour('');
        setDescription('');
        setImageUrl('');
        
        // Refresh grounds list
        const { data } = await supabase.from('grounds').select('*').order('created_at', { ascending: false });
        setGrounds(data || []);
      }
    } catch (error) {
      console.error('Error adding ground:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
    
    setAddLoading(false);
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
        
        // Refresh grounds list
        const { data } = await supabase.from('grounds').select('*').order('created_at', { ascending: false });
        setGrounds(data || []);
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div>Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20">
        <div className="container max-w-6xl mx-auto p-6">
          <div className="bg-white dark:bg-background rounded-lg shadow-md border p-6">
            <div className="flex items-center gap-3 mb-8">
              <Shield className="h-8 w-8 text-amber-600" />
              <h1 className="text-3xl font-extrabold">Admin Dashboard</h1>
              <div className="ml-auto px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                Administrator Access
              </div>
            </div>

            {/* Statistics */}
            <section className="mb-10">
              <h2 className="text-xl font-bold mb-4">Platform Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 dark:bg-green-900/10 p-6 rounded-lg border border-green-100 dark:border-green-900/30">
                  <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">Total Grounds</h3>
                  <p className="text-3xl font-bold text-green-600">{grounds.length}</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-lg border border-blue-100 dark:border-blue-900/30">
                  <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">Total Bookings</h3>
                  <p className="text-3xl font-bold text-blue-600">{bookings.length}</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/10 p-6 rounded-lg border border-purple-100 dark:border-purple-900/30">
                  <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200">Active Bookings</h3>
                  <p className="text-3xl font-bold text-purple-600">
                    {bookings.filter(b => b.status === 'confirmed').length}
                  </p>
                </div>
              </div>
            </section>

            {/* Add Ground Form */}
            <section className="mb-10">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5 text-amber-600" />
                    Add New Cricket Ground
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddGround} className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Ground Name *</Label>
                      <Input 
                        id="name"
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                        placeholder="Enter ground name" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="location">Location *</Label>
                      <Input 
                        id="location"
                        value={location} 
                        onChange={e => setLocation(e.target.value)} 
                        placeholder="Enter location" 
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Address *</Label>
                      <Input 
                        id="address"
                        value={address} 
                        onChange={e => setAddress(e.target.value)} 
                        placeholder="Enter full address" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="price">Price Per Hour (₹) *</Label>
                      <Input 
                        id="price"
                        type="number" 
                        min="0" 
                        value={pricePerHour} 
                        onChange={e => setPricePerHour(e.target.value)} 
                        placeholder="0" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="image">Image URL</Label>
                      <Input 
                        id="image"
                        value={imageUrl} 
                        onChange={e => setImageUrl(e.target.value)} 
                        placeholder="Enter image URL (optional)" 
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="description">Description</Label>
                      <Input 
                        id="description"
                        value={description} 
                        onChange={e => setDescription(e.target.value)} 
                        placeholder="Enter ground description (optional)" 
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <Button type="submit" disabled={addLoading} className="w-full md:w-auto bg-amber-600 hover:bg-amber-700">
                        {addLoading ? 'Adding Ground...' : 'Add Ground'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </section>

            {/* Manage Grounds */}
            <section className="mb-10">
              <h2 className="text-xl font-bold mb-4">Manage Grounds</h2>
              {dataLoading ? (
                <div>Loading grounds...</div>
              ) : grounds.length === 0 ? (
                <p className="text-muted-foreground">No grounds found.</p>
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
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">₹{ground.price_per_hour}/hr</span>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDeleteGround(ground.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>

            {/* Recent Bookings */}
            <section>
              <h2 className="text-xl font-bold mb-4">Recent Bookings</h2>
              {dataLoading ? (
                <div>Loading bookings...</div>
              ) : bookings.length === 0 ? (
                <p className="text-muted-foreground">No bookings found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-200 rounded-lg">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-800">
                        <th className="border border-gray-200 p-3 text-left">Ground</th>
                        <th className="border border-gray-200 p-3 text-left">User</th>
                        <th className="border border-gray-200 p-3 text-left">Date</th>
                        <th className="border border-gray-200 p-3 text-left">Time</th>
                        <th className="border border-gray-200 p-3 text-left">Status</th>
                        <th className="border border-gray-200 p-3 text-left">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.slice(0, 10).map((booking) => (
                        <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="border border-gray-200 p-3">
                            {booking.grounds?.name || 'Unknown Ground'}
                          </td>
                          <td className="border border-gray-200 p-3">
                            {booking.user_profiles?.first_name} {booking.user_profiles?.last_name}
                          </td>
                          <td className="border border-gray-200 p-3">
                            {new Date(booking.booking_date).toLocaleDateString()}
                          </td>
                          <td className="border border-gray-200 p-3">
                            {booking.start_time} - {booking.end_time}
                          </td>
                          <td className="border border-gray-200 p-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="border border-gray-200 p-3">
                            ₹{booking.total_price}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
