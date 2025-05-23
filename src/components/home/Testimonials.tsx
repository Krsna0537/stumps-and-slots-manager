
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

// Temporary testimonial data
const testimonials = [
  {
    id: 1,
    name: 'John Smith',
    role: 'Club Captain',
    content: 'StumpsNSlots has transformed how our club books practice sessions. The interface is intuitive and finding available slots is incredibly easy.',
    rating: 5,
    image: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    role: 'Team Manager',
    content: 'I manage bookings for multiple teams, and this platform has saved me countless hours. The calendar view and instant confirmation are game changers.',
    rating: 5,
    image: 'https://i.pravatar.cc/150?img=5',
  },
  {
    id: 3,
    name: 'Mark Williams',
    role: 'Recreational Player',
    content: 'As a casual player organizing weekend matches with friends, I love how quick it is to find and book grounds. Great customer service too!',
    rating: 4,
    image: 'https://i.pravatar.cc/150?img=3',
  },
];

const Testimonials = () => {
  return (
    <section className="py-16">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Hear from cricket enthusiasts who use our platform for their ground bookings
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="h-full">
              <CardContent className="pt-6 h-full flex flex-col">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < testimonial.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'fill-gray-200 text-gray-200'
                      }`}
                    />
                  ))}
                </div>

                <blockquote className="flex-grow mb-6 italic text-muted-foreground">
                  "{testimonial.content}"
                </blockquote>

                <div className="flex items-center mt-auto">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full mr-4"
                  />
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
