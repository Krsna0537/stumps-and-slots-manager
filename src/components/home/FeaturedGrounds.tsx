
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { AccessibilityWrapper } from '@/components/accessibility/AccessibilityWrapper';

const FeaturedGrounds = () => {
  const [grounds, setGrounds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrounds = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('grounds')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);
        
        if (error) {
          console.error('Error fetching grounds:', error);
          setGrounds([]);
        } else {
          setGrounds(data || []);
        }
      } catch (error) {
        console.error('Unexpected error fetching grounds:', error);
        setGrounds([]);
      }
      setLoading(false);
    };
    fetchGrounds();
  }, []);

  return (
    <AccessibilityWrapper 
      announceOnMount={loading ? "Loading featured grounds" : `${grounds.length} featured grounds available`}
      ariaLabel="Featured cricket grounds section"
    >
      <section className="py-16 bg-white dark:bg-background">
        <div className="container">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold" id="featured-grounds-title">Featured Grounds</h2>
              <p className="text-muted-foreground mt-2">Discover top-rated cricket grounds</p>
            </div>
            <Button variant="outline" asChild>
              <Link 
                to="/grounds"
                aria-label="View all cricket grounds"
              >
                View All Grounds
              </Link>
            </Button>
          </div>

          {loading ? (
            <div 
              className="text-center text-muted-foreground py-12"
              aria-live="polite"
              aria-label="Loading grounds"
            >
              Loading grounds...
            </div>
          ) : grounds.length === 0 ? (
            <div 
              className="text-center text-muted-foreground py-12"
              aria-live="polite"
            >
              No grounds available.
            </div>
          ) : (
            <div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              role="list"
              aria-labelledby="featured-grounds-title"
            >
              {grounds.map(ground => (
                <Card 
                  key={ground.id} 
                  className="overflow-hidden transition-all duration-300 hover:shadow-lg focus-within:ring-2 focus-within:ring-primary"
                  role="listitem"
                >
                  <div className="aspect-video w-full overflow-hidden">
                    <img 
                      src={ground.image_url || '/cric.jpg'} 
                      alt={`${ground.name} cricket ground`}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl">{ground.name}</CardTitle>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <span aria-label="Location">{ground.location}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1" aria-label="Rating">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                        <span className="font-medium">4.5</span>
                        <span className="sr-only">out of 5 stars</span>
                      </div>
                      <div className="font-semibold" aria-label="Price per hour">
                        ₹{ground.price_per_hour}/hr
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" asChild>
                      <Link 
                        to={`/grounds/${ground.id}`}
                        aria-label={`Book ${ground.name} cricket ground`}
                      >
                        Book Now
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </AccessibilityWrapper>
  );
};

export default FeaturedGrounds;
