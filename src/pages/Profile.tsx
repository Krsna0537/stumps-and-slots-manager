
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Calendar, Edit3, Save, X, History, Clock, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/login');
        return;
      }
      
      setUser(user);
      
      try {
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profileError) {
          console.error('Profile error:', profileError);
          toast({
            title: "Profile Error",
            description: "Could not fetch user profile.",
            variant: "destructive",
          });
        } else {
          setProfile(profileData);
          setFirstName(profileData?.first_name || '');
          setLastName(profileData?.last_name || '');
        }

        // Fetch user bookings
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select(`
            *,
            grounds:ground_id (name, location, image_url, price_per_hour)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (bookingsError) {
          console.error('Bookings error:', bookingsError);
        } else {
          setBookings(bookingsData || []);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      }
      
      setLoading(false);
    };
    
    fetchProfile();
  }, [navigate, toast]);

  const handleSave = async () => {
    setSaving(true);
    
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          first_name: firstName,
          last_name: lastName
        })
        .eq('id', user.id);

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setProfile({ ...profile, first_name: firstName, last_name: lastName });
        setEditing(false);
        toast({
          title: "Success",
          description: "Profile updated successfully!",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFirstName(profile?.first_name || '');
    setLastName(profile?.last_name || '');
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-12">
          <div>Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-12">
          <div className="container max-w-md text-center">
            <p className="text-lg mb-4">You must be logged in to view your profile.</p>
            <Button onClick={() => navigate('/login')}>Go to Login</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Profile</h1>
            <p className="text-muted-foreground">Manage your account information and view your bookings</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                  {!editing && (
                    <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {editing ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="Enter first name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Enter last name"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSave} disabled={saving}>
                        <Save className="h-4 w-4 mr-2" />
                        {saving ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button variant="outline" onClick={handleCancel}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">First Name</Label>
                      <p className="font-medium">{profile?.first_name || 'Not set'}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Last Name</Label>
                      <p className="font-medium">{profile?.last_name || 'Not set'}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Account Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Email Address</Label>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Account Created</Label>
                  <p className="font-medium">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Total Bookings</Label>
                  <p className="font-medium">{bookings.length}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* My Bookings */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                My Bookings ({bookings.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {bookings.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">You haven't made any bookings yet.</p>
                  <Button asChild>
                    <a href="/grounds">Browse Grounds</a>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <Card key={booking.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <img
                            src={booking.grounds?.image_url || '/cric.jpg'}
                            alt={booking.grounds?.name}
                            className="w-20 h-20 object-cover rounded-md"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{booking.grounds?.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              <MapPin className="h-4 w-4" />
                              {booking.grounds?.location}
                            </div>
                            <div className="flex items-center gap-4 mt-2">
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4" />
                                {new Date(booking.booking_date).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Clock className="h-4 w-4" />
                                {booking.start_time} - {booking.end_time}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">₹{booking.total_price}</div>
                            <div className={`text-sm mt-1 ${
                              booking.status === 'confirmed' ? 'text-green-600' :
                              booking.status === 'pending' ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                              {booking.status}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" onClick={() => navigate('/dashboard')} className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Go to Dashboard
                </Button>
                <Button variant="outline" onClick={() => navigate('/grounds')} className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Browse Grounds
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
