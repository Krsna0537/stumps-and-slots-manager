
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Star, MapPin, Calendar, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

// Temporary grounds data - will be replaced with backend data
const grounds = [
  {
    id: 1,
    name: 'Central Cricket Stadium',
    location: 'Downtown, City Center',
    rating: 4.8,
    price: 150,
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=500&auto=format&fit=crop',
    features: ['Floodlights', 'Pavilion', 'Parking'],
  },
  {
    id: 2,
    name: 'Riverside Ground',
    location: 'Riverside Park, East Side',
    rating: 4.5,
    price: 120,
    image: 'https://images.unsplash.com/photo-1562077772-3bd90403f7f0?q=80&w=500&auto=format&fit=crop',
    features: ['Practice Nets', 'Changing Rooms', 'Cafe'],
  },
  {
    id: 3,
    name: 'Green Valley Cricket Club',
    location: 'Green Valley, North Area',
    rating: 4.9,
    price: 180,
    image: 'https://images.unsplash.com/photo-1627556592933-ffe99c1cd9eb?q=80&w=500&auto=format&fit=crop',
    features: ['Electronic Scoreboard', 'Floodlights', 'Premium Pitch'],
  },
  {
    id: 4,
    name: 'East Park Cricket Ground',
    location: 'East Park, South District',
    rating: 4.3,
    price: 110,
    image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=500&auto=format&fit=crop',
    features: ['Practice Nets', 'Basic Amenities', 'Parking'],
  },
  {
    id: 5,
    name: 'Sunset Cricket Academy',
    location: 'West Hills, City Outskirts',
    rating: 4.7,
    price: 165,
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=500&auto=format&fit=crop',
    features: ['Professional Coaching', 'Multiple Pitches', 'Video Analysis'],
  },
  {
    id: 6,
    name: 'Metropolitan Cricket Ground',
    location: 'City Center, Main Area',
    rating: 4.6,
    price: 145,
    image: 'https://images.unsplash.com/photo-1607734834519-d8576ae60ea6?q=80&w=500&auto=format&fit=crop',
    features: ['Floodlights', 'Spectator Stands', 'Food Court'],
  },
];

const GroundsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container">
          {/* Page header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Cricket Grounds</h1>
              <p className="text-muted-foreground">Find and book the perfect cricket ground</p>
            </div>
          </div>
          
          {/* Search and filter section */}
          <div className="bg-white dark:bg-background border rounded-lg p-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  placeholder="Search grounds by name" 
                  className="pl-10"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  placeholder="Location" 
                  className="pl-10"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  placeholder="Select Date" 
                  className="pl-10"
                  type="date"
                />
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                More Filters
              </Button>
              <Button>Search</Button>
            </div>
          </div>
          
          {/* Results section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {grounds.map(ground => (
              <Card key={ground.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                <div className="aspect-video w-full overflow-hidden">
                  <img 
                    src={ground.image} 
                    alt={ground.name} 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{ground.name}</CardTitle>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{ground.location}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{ground.rating}</span>
                    </div>
                    <div className="font-semibold">${ground.price}/hr</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {ground.features.map((feature, index) => (
                      <span key={index} className="bg-muted/50 px-2 py-1 rounded-md text-xs">
                        {feature}
                      </span>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link to={`/grounds/${ground.id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Pagination placeholder */}
          <div className="flex justify-center mt-8">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GroundsPage;
