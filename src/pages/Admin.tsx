import React, { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Admin = () => {
  // Auth and admin check
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // Form state
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [pricePerHour, setPricePerHour] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState('');

  // Data state
  const [grounds, setGrounds] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user and admin status
  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();
        setIsAdmin(profile?.is_admin === true);
      } else {
        setIsAdmin(false);
      }
      setProfileLoading(false);
    };
    fetchProfile();
  }, []);

  // Fetch grounds and bookings
  useEffect(() => {
    if (!isAdmin) return;
    const fetchData = async () => {
      setLoading(true);
      const { data: groundsData } = await supabase.from('grounds').select('*');
      setGrounds(groundsData || []);
      const { data: bookingsData } = await supabase.from('bookings').select('*');
      setBookings(bookingsData || []);
      setLoading(false);
    };
    fetchData();
  }, [addSuccess, isAdmin]);

  // Add new ground
  const handleAddGround = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');
    setAddSuccess('');
    if (!name || !location || !address || !pricePerHour) {
      setAddError('Name, location, address, and price per hour are required.');
      return;
    }
    const { error } = await supabase.from('grounds').insert({
      name,
      location,
      address,
      price_per_hour: Number(pricePerHour),
      description,
      image_url: imageUrl
    });
    if (error) {
      setAddError(error.message);
    } else {
      setAddSuccess('Ground added successfully!');
      setName('');
      setLocation('');
      setAddress('');
      setPricePerHour('');
      setDescription('');
      setImageUrl('');
    }
  };

  if (profileLoading) return <div>Loading...</div>;
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-12">
          <div className="container max-w-md text-center bg-white dark:bg-background rounded-lg shadow-md border p-8">
            <h1 className="text-2xl font-bold mb-4 text-red-600">Access Denied</h1>
            <p className="text-lg">You do not have permission to view this page.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center py-12 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
        <div className="container max-w-3xl mx-auto p-6 bg-white dark:bg-background rounded-lg shadow-md border">
          <h1 className="text-3xl font-extrabold mb-6 text-center">Admin Dashboard</h1>

          {/* Add Ground Form */}
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4">Add New Ground</h2>
            <form onSubmit={handleAddGround} className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="font-medium">Name</label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="Ground Name" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-medium">Location</label>
                <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="Location" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-medium">Address</label>
                <Input value={address} onChange={e => setAddress(e.target.value)} placeholder="Address" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-medium">Price Per Hour (₹)</label>
                <Input type="number" min="0" value={pricePerHour} onChange={e => setPricePerHour(e.target.value)} placeholder="Price Per Hour" />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="font-medium">Description</label>
                <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="font-medium">Image URL</label>
                <Input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="Image URL (optional)" />
              </div>
              <div className="md:col-span-2 flex gap-4 items-center">
                <Button type="submit">Add Ground</Button>
                {addError && <span className="text-red-600 text-sm">{addError}</span>}
                {addSuccess && <span className="text-green-600 text-sm">{addSuccess}</span>}
              </div>
            </form>
          </section>

          {/* Grounds List */}
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4">All Grounds</h2>
            {loading ? <div>Loading...</div> : (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {grounds.map((g, idx) => (
                  <li key={idx} className="p-4 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30">
                    <div className="font-semibold text-lg text-green-800 dark:text-green-200">{g.name}</div>
                    <div className="text-sm text-muted-foreground">{g.location}</div>
                    {g.image_url && <img src={g.image_url} alt={g.name} className="h-24 w-auto mt-2 rounded shadow" />}
                    <div className="text-xs mt-2">{g.description}</div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Bookings List */}
          <section>
            <h2 className="text-xl font-bold mb-4">All Bookings</h2>
            {loading ? <div>Loading...</div> : (
              <ul className="grid grid-cols-1 gap-4">
                {bookings.map((b, idx) => (
                  <li key={idx} className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
                    <div className="font-semibold text-green-800 dark:text-green-200">Ground: {b.ground_name || b.ground_id}</div>
                    <div className="text-sm">Booked by: {b.user_email || b.user_id}</div>
                    <div className="text-xs text-muted-foreground">Date: {b.date || b.created_at}</div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Admin; 