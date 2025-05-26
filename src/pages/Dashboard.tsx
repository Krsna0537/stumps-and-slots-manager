
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import NotificationCenter from '@/components/notifications/NotificationCenter';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, MapPin, Bell } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { user, userRole, loading } = useAuth('user');
  const [bookings, setBookings] = useState<any[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchUserBookings();
      fetchNotificationCount();
    }
  }, [user]);

  const fetchUserBookings = async () => {
    try {
      setBookingsLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          grounds:ground_id (name, location, image_url)
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bookings:', error);
        toast({
          title: "Error",
          description: "Failed to fetch your bookings.",
          variant: "destructive",
        });
      } else {
        setBookings(data || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setBookingsLoading(false);
    }
  };

  const fetchNotificationCount = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('id', { count: 'exact' })
        .eq('user_id', user?.id)
        .eq('is_read', false);

      if (!error && data) {
        setUnreadCount(data.length);
      }
    } catch (error) {
      console.error('Error fetching notification count:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: string } = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
      completed: 'bg-blue-100 text-blue-800'
    };

    return (
      <Badge className={variants[status] || 'bg-gray-100 text-gray-800'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (loading || bookingsLoading) {
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
      <main className="flex-1 py-8 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
        <div className="container max-w-7xl mx-auto p-6">
          <div className="bg-white dark:bg-background rounded-lg shadow-md border p-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-extrabold">Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                  Welcome back! Manage your cricket ground bookings.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative"
              >
                <Bell className="h-4 w-4 mr-2" />
                Notifications
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-2 -right-2 text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </div>

            {showNotifications ? (
              <NotificationCenter />
            ) : (
              <div className="space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{bookings.length}</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {bookings.filter(b => b.status === 'pending').length}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {bookings.filter(b => b.status === 'confirmed').length}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Bookings */}
                <Card>
                  <CardHeader>
                    <CardTitle>Your Recent Bookings</CardTitle>
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
                        {bookings.slice(0, 5).map((booking) => (
                          <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-4">
                              <img
                                src={booking.grounds?.image_url || '/cric.jpg'}
                                alt={booking.grounds?.name}
                                className="w-16 h-16 rounded object-cover"
                              />
                              <div>
                                <h3 className="font-semibold">{booking.grounds?.name}</h3>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  {booking.grounds?.location}
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <CalendarDays className="h-4 w-4 mr-1" />
                                  {format(new Date(booking.booking_date), 'PPP')}
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {booking.start_time} - {booking.end_time}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              {getStatusBadge(booking.status)}
                              <div className="text-sm font-medium mt-1">₹{booking.total_price}</div>
                            </div>
                          </div>
                        ))}
                        {bookings.length > 5 && (
                          <div className="text-center pt-4">
                            <Button variant="outline" asChild>
                              <a href="/profile">View All Bookings</a>
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
