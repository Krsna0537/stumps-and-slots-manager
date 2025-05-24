import React, { useState, useEffect } from 'react';
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
import { supabase } from '@/integrations/supabase/client';

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
  const [isLoading, setIsLoading] = useState(true);
  const [grounds, setGrounds] = useState<any[]>([]);
  const [priceRange, setPriceRange] = useState([100, 200]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  // Fetch real grounds data from Supabase
  useEffect(() => {
    const fetchGrounds = async () => {
      setIsLoading(true);
      const { data } = await supabase.from('grounds').select('*');
      setGrounds(data || []);
      setIsLoading(false);
    };
    fetchGrounds();
  }, []);

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
              {grounds.length === 0 ? (
                <div className="col-span-full text-center text-muted-foreground">No grounds found.</div>
              ) : (
                grounds.map((ground) => (
                  <Card key={ground.id} className="overflow-hidden">
                    <div className="aspect-video w-full">
                      <img
                        src={ground.image_url || '/cric.jpg'}
                        alt={ground.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl font-bold">{ground.name}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {ground.location}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{ground.rating ? ground.rating : 'N/A'} Rating</span>
                        <Clock className="h-4 w-4 ml-4" />
                        <span>₹{ground.price_per_hour}/hr</span>
                      </div>
                      {/* If you have features/facilities in your schema, map them here. */}
                    </CardContent>
                    <CardFooter>
                      <Button asChild className="w-full">
                        <Link to={`/grounds/${ground.id}`}>View Details</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
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
