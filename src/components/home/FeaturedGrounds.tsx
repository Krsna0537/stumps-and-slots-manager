
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';

// Temporary data - will be replaced with actual data from backend
const grounds = [
  {
    id: 1,
    name: 'Central Cricket Stadium',
    location: 'Downtown, City Center',
    rating: 4.8,
    price: 150,
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: 2,
    name: 'Riverside Ground',
    location: 'Riverside Park, East Side',
    rating: 4.5,
    price: 120,
    image: 'https://images.unsplash.com/photo-1562077772-3bd90403f7f0?q=80&w=500&auto=format&fit=crop'
  },
  {
    id: 3,
    name: 'Green Valley Cricket Club',
    location: 'Green Valley, North Area',
    rating: 4.9,
    price: 180,
    image: 'https://images.unsplash.com/photo-1627556592933-ffe99c1cd9eb?q=80&w=500&auto=format&fit=crop'
  }
];

const FeaturedGrounds = () => {
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
                  <span>{ground.location}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{ground.rating}</span>
                  </div>
                  <div className="font-semibold">${ground.price}/hr</div>
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
      </div>
    </section>
  );
};

export default FeaturedGrounds;
