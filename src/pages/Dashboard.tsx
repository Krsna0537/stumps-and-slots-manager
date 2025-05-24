
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Star, Calendar, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

const Dashboard = () => {
  const [grounds, setGrounds] = useState<any[]>([]);
  const [filteredGrounds, setFilteredGrounds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      // Fetch grounds
      const { data: groundsData } = await supabase.from('grounds').select('*').order('created_at', { ascending: false });
      setGrounds(groundsData || []);
      setFilteredGrounds(groundsData || []);
      
      setLoading(false);
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredGrounds(grounds);
    } else {
      const filtered = grounds.filter(ground =>
        ground.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ground.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredGrounds(filtered);
    }
  }, [searchQuery, grounds]);

  if (loading) {
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

          {/* Search Section */}
          <div className="bg-white dark:bg-background border rounded-lg p-6 shadow-sm mb-8">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Search grounds by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-lg">Available Grounds</h3>
                <p className="text-3xl font-bold text-green-600">{grounds.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-lg">Easy Booking</h3>
                <p className="text-sm text-muted-foreground">Book in just a few clicks</p>
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
              {searchQuery ? `Search Results (${filteredGrounds.length})` : 'Available Grounds'}
            </h2>
            <Button variant="outline" asChild>
              <Link to="/grounds">View All Grounds</Link>
            </Button>
          </div>

          {/* Grounds Grid */}
          {filteredGrounds.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground text-lg">
                {searchQuery ? 'No grounds found matching your search.' : 'No grounds available at the moment.'}
              </div>
              {searchQuery && (
                <Button variant="outline" onClick={() => setSearchQuery('')} className="mt-4">
                  Clear Search
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
