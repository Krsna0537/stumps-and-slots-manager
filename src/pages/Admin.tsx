
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Shield, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

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
      
      const [groundsResponse, bookingsResponse] = await Promise.all([
        supabase.from('grounds').select('*').order('created_at', { ascending: false }),
        supabase.from('bookings').select(`
          *,
          profiles:user_id (first_name, last_name),
          grounds:ground_id (name)
        `).order('created_at', { ascending: false })
      ]);
      
      setGrounds(groundsResponse.data || []);
      setBookings(bookingsResponse.data || []);
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
    
    setAddLoading(false);
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

            {/* Add Ground Form */}
            <section className="mb-10">
              <div className="flex items-center gap-2 mb-6">
                <Plus className="h-5 w-5 text-amber-600" />
                <h2 className="text-xl font-bold">Add New Cricket Ground</h2>
              </div>
              
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
            </section>

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
                            {booking.profiles?.first_name} {booking.profiles?.last_name}
                          </td>
                          <td className="border border-gray-200 p-3">
                            {new Date(booking.booking_date).toLocaleDateString()}
                          </td>
                          <td className="border border-gray-200 p-3">
                            {booking.time_slot || `${booking.start_time} - ${booking.end_time}`}
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
