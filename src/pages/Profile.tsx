import React, { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { supabase } from '@/integrations/supabase/client';

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(data);
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div><Navbar /><main className="flex-1 flex items-center justify-center py-12"><div className="container max-w-md text-center">You must be logged in to view your profile.</div></main><Footer /></div>;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="container max-w-md">
          <div className="bg-white dark:bg-background border rounded-lg p-6 shadow-sm">
            <h1 className="text-2xl font-bold mb-4">My Profile</h1>
            <div className="mb-2"><strong>Email:</strong> {user.email}</div>
            <div className="mb-2"><strong>First Name:</strong> {profile?.first_name || '-'}</div>
            <div className="mb-2"><strong>Last Name:</strong> {profile?.last_name || '-'}</div>
            <div className="mb-2"><strong>Joined:</strong> {user.created_at ? new Date(user.created_at).toLocaleString() : '-'}</div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile; 