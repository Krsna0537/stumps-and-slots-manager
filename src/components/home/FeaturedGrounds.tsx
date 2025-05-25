import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const FeaturedGrounds = () => {
  const [grounds, setGrounds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrounds = async () => {
      setLoading(true);
      // Fetch only grounds added by admin (owner_id not null)
      const { data } = await supabase
        .from('grounds')
        .select('*')
        .order('created_at', { ascending: false });
      setGrounds(data || []);
      setLoading(false);
    };
    fetchGrounds();
  }, []);

  return (
    <section className="py-16 bg-white dark:bg-background">
      <div className="container">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold">Featured Grounds</h2>
            <p className="text-muted-foreground mt-2">Discover top-rated cricket grounds</p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/grounds">View All Grounds</Link>
          </Button>
        </div>

        {loading ? (
          <div className="text-center text-muted-foreground py-12">Loading grounds...</div>
        ) : grounds.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">No grounds available.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {grounds.slice(0, 3).map(ground => (
              <Card key={ground.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                <div className="aspect-video w-full overflow-hidden">
                  <img 
                    src={ground.image_url || '/cric.jpg'} 
                    alt={ground.name} 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{ground.name}</CardTitle>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <span>{ground.location}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{ground.rating || 'N/A'}</span>
                    </div>
                    <div className="font-semibold">₹{ground.price_per_hour}/hr</div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link to={`/grounds/${ground.id}`}>Book Now</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedGrounds;
