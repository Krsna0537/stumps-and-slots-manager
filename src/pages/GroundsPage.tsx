
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Star, MapPin, Calendar, Filter, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Skeleton } from '@/components/ui/skeleton';

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

// Features for filtering
const allFeatures = [
  'Floodlights',
  'Practice Nets',
  'Pavilion',
  'Electronic Scoreboard',
  'Changing Rooms',
  'Parking',
  'Cafe',
  'Multiple Pitches',
  'Premium Pitch',
  'Video Analysis',
  'Spectator Stands',
  'Food Court',
];

const GroundsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [priceRange, setPriceRange] = useState([100, 200]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  const toggleFeature = (feature: string) => {
    if (selectedFeatures.includes(feature)) {
      setSelectedFeatures(selectedFeatures.filter(f => f !== feature));
    } else {
      setSelectedFeatures([...selectedFeatures, feature]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 mx-auto">
          {/* Page header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Cricket Grounds</h1>
              <p className="text-muted-foreground text-lg">Find and book the perfect cricket ground</p>
            </div>
          </div>
          
          {/* Search and filter section */}
          <div className="bg-white dark:bg-background border rounded-lg p-6 shadow-sm mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input 
                  placeholder="Search grounds by name" 
                  className="pl-10 h-12 text-base bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input 
                  placeholder="Location" 
                  className="pl-10 h-12 text-base bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input 
                  placeholder="Select Date" 
                  className="pl-10 h-12 text-base bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  type="date"
                />
              </div>
            </div>

            <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen} className="mt-6">
              <div className="flex justify-between items-center">
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="gap-2 h-12 px-5">
                    <Filter className="h-5 w-5" />
                    {filtersOpen ? 'Hide Filters' : 'More Filters'}
                  </Button>
                </CollapsibleTrigger>
                <Button className="h-12 px-6 font-medium">
                  Search Grounds
                </Button>
              </div>
              
              <CollapsibleContent className="mt-6">
                <div className="space-y-6">
                  {/* Price range slider */}
                  <div>
                    <h3 className="font-medium mb-4">Price Range ($/hour)</h3>
                    <div className="px-2">
                      <Slider 
                        defaultValue={[100, 200]} 
                        min={50} 
                        max={300} 
                        step={5} 
                        value={priceRange}
                        onValueChange={setPriceRange}
                        className="mb-2"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Facilities/features */}
                  <div>
                    <h3 className="font-medium mb-4">Ground Features</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-2">
                      {allFeatures.map((feature) => (
                        <div key={feature} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`feature-${feature}`}
                            checked={selectedFeatures.includes(feature)}
                            onCheckedChange={() => toggleFeature(feature)}
                          />
                          <Label htmlFor={`feature-${feature}`} className="text-sm">
                            {feature}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
          
          {/* Results count and sort */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <p className="text-muted-foreground mb-2 sm:mb-0">
              Showing <span className="font-medium text-foreground">{grounds.length}</span> grounds
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <select className="text-sm border rounded p-1 bg-background">
                <option>Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Rating: High to Low</option>
              </select>
            </div>
          </div>
          
          {/* Results section */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-video w-full" />
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4 mb-2" />
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {grounds.map(ground => (
                <Card key={ground.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg border-gray-200 dark:border-gray-800">
                  <div className="aspect-video w-full overflow-hidden relative group">
                    <img 
                      src={ground.image} 
                      alt={ground.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-3 right-3 bg-black/60 text-white rounded-full px-3 py-1 text-sm font-medium">
                      ${ground.price}/hr
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl line-clamp-1">{ground.name}</CardTitle>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{ground.location}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded text-sm">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{ground.rating} Rating</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>2 hr min</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {ground.features.map((feature, index) => (
                        <span key={index} className="inline-flex items-center gap-1 bg-muted/50 px-2 py-1 rounded-md text-xs">
                          <CheckCircle className="h-3 w-3" />
                          {feature}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full text-base" size="lg" asChild>
                      <Link to={`/grounds/${ground.id}`}>View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination with enhanced styling */}
          <div className="flex justify-center mt-12">
            <div className="inline-flex items-center bg-white dark:bg-background border rounded-md shadow-sm overflow-hidden">
              <Button variant="ghost" size="sm" className="rounded-none border-r h-10 px-4" disabled>
                Previous
              </Button>
              <Button variant="ghost" size="sm" className="rounded-none border-r h-10 w-10 p-0 bg-primary/10">1</Button>
              <Button variant="ghost" size="sm" className="rounded-none border-r h-10 w-10 p-0">2</Button>
              <Button variant="ghost" size="sm" className="rounded-none border-r h-10 w-10 p-0">3</Button>
              <Button variant="ghost" size="sm" className="rounded-none h-10 px-4">
                Next
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GroundsPage;
