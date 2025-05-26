import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Star, Calendar, Clock, History, Filter, Bell } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';

interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  is_read: boolean;
  created_at: string;
}

interface Ground {
  id: string;
  name: string;
  description: string;
  location: string;
  address: string;
  price_per_hour: number;
  image_url: string;
  owner_id: string;
  is_featured: boolean;
  latitude: number;
  longitude: number;
  created_at: string;
  updated_at: string;
}

interface Booking {
  id: string;
  user_id: string;
  ground_id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  total_price: number;
  grounds?: {
    name: string;
    location: string;
    image_url: string;
  };
}

const Dashboard = () => {
  const { user, userRole, loading: authLoading } = useAuth('user');
  const [grounds, setGrounds] = useState<Ground[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredGrounds, setFilteredGrounds] = useState<Ground[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch grounds
        const { data: groundsData, error: groundsError } = await supabase
          .from('grounds')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (groundsError) {
          setError('Error fetching grounds.');
          setLoading(false);
          return;
        } else {
          setGrounds(groundsData || []);
          setFilteredGrounds(groundsData || []);
        }

        // Fetch user's bookings and notifications if logged in
        if (user) {
          const [bookingsResponse, notificationsResponse] = await Promise.all([
            supabase
              .from('bookings')
              .select(`
                *,
                grounds:ground_id (name, location, image_url)
              `)
              .eq('user_id', user.id)
              .order('created_at', { ascending: false })
              .limit(3),
            
            supabase
              .from('notifications')
              .select('*')
              .eq('user_id', user.id)
              .eq('is_read', false)
              .order('created_at', { ascending: false })
              .limit(5)
          ]);

          if (bookingsResponse.error) {
            setError('Error fetching bookings.');
            setLoading(false);
            return;
          } else {
            setBookings(bookingsResponse.data || []);
          }
          
          if (notificationsResponse.error) {
            setError('Error fetching notifications.');
            setLoading(false);
            return;
          } else {
            setNotifications(notificationsResponse.data || []);
          }
        }
      } catch (error) {
        setError('Unexpected error fetching data.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [authLoading, user]);

  useEffect(() => {
    let filtered = grounds;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(ground =>
        ground.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ground.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply location filter
    if (locationFilter !== 'all') {
      filtered = filtered.filter(ground =>
        ground.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    // Apply price filter
    if (priceFilter !== 'all') {
      if (priceFilter === 'low') {
        filtered = filtered.filter(ground => ground.price_per_hour <= 500);
      } else if (priceFilter === 'medium') {
        filtered = filtered.filter(ground => ground.price_per_hour > 500 && ground.price_per_hour <= 1000);
      } else if (priceFilter === 'high') {
        filtered = filtered.filter(ground => ground.price_per_hour > 1000);
      }
    }

    setFilteredGrounds(filtered);
  }, [searchQuery, locationFilter, priceFilter, grounds]);

  const getUniqueLocations = () => {
    const locations = grounds.map(ground => ground.location);
    return [...new Set(locations)];
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
      completed: 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-8 bg-gray-50 dark:bg-gray-900">
          <div className="container">
            <div className="mb-8">
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-96" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-video w-full" />
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-10 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-8 bg-gray-50 dark:bg-gray-900">
          <div className="container text-center py-12">
            <div className="text-red-600 text-lg font-semibold mb-4">{error}</div>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-8 bg-gray-50 dark:bg-gray-900">
        <div className="container">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}!
            </h1>
            <p className="text-muted-foreground text-lg">Find and book the perfect cricket ground for your next game</p>
          </div>

          {/* Notifications Alert */}
          {notifications.length > 0 && (
            <Card className="mb-8 border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Bell className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-medium text-blue-900 mb-1">You have {notifications.length} new notification{notifications.length > 1 ? 's' : ''}</h3>
                    <p className="text-sm text-blue-700">{notifications[0]?.message}</p>
                    {notifications.length > 1 && (
                      <p className="text-xs text-blue-600 mt-1">+{notifications.length - 1} more...</p>
                    )}
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/profile">View All</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* My Bookings Section */}
          {bookings.length > 0 && (
            <div className="bg-white dark:bg-background border rounded-lg p-6 shadow-sm mb-8">
              <div className="flex items-center gap-2 mb-4">
                <History className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-bold">My Recent Bookings</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bookings.map((booking) => (
                  <Card key={booking.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{booking.grounds?.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{booking.grounds?.location}</p>
                        </div>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4" />
                          {new Date(booking.booking_date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4" />
                          {booking.start_time} - {booking.end_time}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Button variant="outline" asChild>
                  <Link to="/profile">View All Bookings</Link>
                </Button>
              </div>
            </div>
          )}

          {/* Search and Filter Section */}
          <div className="bg-white dark:bg-background border rounded-lg p-6 shadow-sm mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  placeholder="Search grounds by name or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-base"
                />
              </div>
              
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Filter by location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {getUniqueLocations().map((location) => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Filter by price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="low">₹0 - ₹500</SelectItem>
                  <SelectItem value="medium">₹500 - ₹1000</SelectItem>
                  <SelectItem value="high">₹1000+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-lg">Available Grounds</h3>
                <p className="text-3xl font-bold text-green-600">{filteredGrounds.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <History className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-lg">My Bookings</h3>
                <p className="text-3xl font-bold text-blue-600">{bookings.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <h3 className="font-semibold text-lg">Quality Grounds</h3>
                <p className="text-sm text-muted-foreground">Premium cricket facilities</p>
              </CardContent>
            </Card>
          </div>

          {/* Search Results */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {searchQuery || locationFilter !== 'all' || priceFilter !== 'all' 
                ? `Search Results (${filteredGrounds.length})` 
                : 'Available Grounds'}
            </h2>
            <Button variant="outline" asChild>
              <Link to="/grounds">View All Grounds</Link>
            </Button>
          </div>

          {/* Grounds Grid */}
          {filteredGrounds.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground text-lg">
                {searchQuery || locationFilter !== 'all' || priceFilter !== 'all' 
                  ? 'No grounds found matching your criteria.' 
                  : 'No grounds available at the moment.'}
              </div>
              {(searchQuery || locationFilter !== 'all' || priceFilter !== 'all') && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery('');
                    setLocationFilter('all');
                    setPriceFilter('all');
                  }} 
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGrounds.slice(0, 6).map((ground) => (
                <Card key={ground.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video w-full">
                    <img
                      src={ground.image_url || '/cric.jpg'}
                      alt={ground.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl">{ground.name}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {ground.location}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 mb-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">4.5</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm font-medium">₹{ground.price_per_hour}/hr</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {ground.description || 'Professional cricket ground with modern facilities.'}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full">
                      <Link to={`/grounds/${ground.id}`}>Book Now</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {filteredGrounds.length > 6 && (
            <div className="text-center mt-8">
              <Button asChild variant="outline" size="lg">
                <Link to="/grounds">View All {filteredGrounds.length} Grounds</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
