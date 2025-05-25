import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Star, Clock } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const GroundDetail = () => {
  const { id } = useParams();
  const [ground, setGround] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState<string>("");
  const [timeSlot, setTimeSlot] = useState<string>("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchGround = async () => {
      setLoading(true);
      const { data } = await supabase.from('grounds').select('*').eq('id', id).single();
      setGround(data);
      setLoading(false);
    };
    if (id) fetchGround();
    // Fetch user
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, [id]);

  const parseTimeSlot = (slot: string) => {
    // Parse "9:00 AM - 11:00 AM" format
    const [start, end] = slot.split(' - ');
    return {
      start_time: convertTo24Hour(start.trim()),
      end_time: convertTo24Hour(end.trim())
    };
  };

  const convertTo24Hour = (time12h: string) => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') {
      hours = '00';
    }
    if (modifier === 'PM' && hours !== '12') {
      hours = (parseInt(hours, 10) + 12).toString();
    }
    return `${hours}:${minutes}:00`;
  };

  const calculateTotalPrice = (timeSlot: string, pricePerHour: number) => {
    // Calculate duration in hours based on time slot
    const [start, end] = timeSlot.split(' - ');
    const startHour = parseInt(start.split(':')[0]);
    const endHour = parseInt(end.split(':')[0]);
    let duration = endHour - startHour;
    
    // Handle PM times
    if (end.includes('PM') && !start.includes('PM') && startHour !== 12) {
      duration = (endHour + 12) - startHour;
    } else if (end.includes('PM') && start.includes('PM')) {
      duration = endHour - startHour;
    }
    
    return duration * pricePerHour;
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to book a ground.",
        variant: "destructive",
      });
      return;
    }
    
    if (!date || !timeSlot) {
      toast({
        title: "Missing Information",
        description: "Please select a date and time slot.",
        variant: "destructive",
      });
      return;
    }
    
    setBookingLoading(true);
    
    try {
      const { start_time, end_time } = parseTimeSlot(timeSlot);
      const total_price = calculateTotalPrice(timeSlot, ground.price_per_hour);
      
      // Redirect to payment page with booking details
      navigate('/payment', {
        state: {
          bookingDetails: {
            user_id: user.id,
            ground_id: ground.id,
            date,
            time_slot: timeSlot,
            start_time,
            end_time,
            total_price,
          }
        }
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
    
    setBookingLoading(false);
  };

  // Example time slots
  const timeSlots = [
    "9:00 AM - 11:00 AM",
    "11:00 AM - 1:00 PM",
    "1:00 PM - 3:00 PM",
    "3:00 PM - 5:00 PM",
    "5:00 PM - 7:00 PM",
    "7:00 PM - 9:00 PM",
  ];

  if (loading) return <div>Loading...</div>;
  if (!ground) return <div>Ground not found.</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/grounds">Grounds</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink>{ground.name}</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Ground header */}
          <div className="flex flex-col gap-4 mb-8">
            <h1 className="text-3xl font-bold">{ground.name}</h1>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {ground.location}
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span>4.5</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>Price: ₹{ground.price_per_hour}/hour</span>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column - Ground details */}
            <div className="lg:col-span-2">
              {/* Image gallery */}
              <div className="mb-8">
                <div className="aspect-video w-full mb-2">
                  <img 
                    src={ground.image_url || '/cric.jpg'} 
                    alt={ground.name} 
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </div>

              {/* Tabs for details */}
              <Tabs defaultValue="description">
                <TabsList className="w-full grid grid-cols-1">
                  <TabsTrigger value="description">Description</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="py-4">
                  <p className="text-muted-foreground">{ground.description}</p>
                  <div className="mt-4">
                    <h3 className="font-semibold mb-2">Address</h3>
                    <p className="text-muted-foreground">{ground.address}</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Right column - Booking and info */}
            <div>
              <Card>
                <CardContent className="p-4">
                  <div className="mb-4">
                    <h2 className="text-xl font-bold mb-2">Book This Ground</h2>
                    <form onSubmit={handleBooking} className="space-y-4">
                      <div>
                        <label className="block font-medium mb-1">Select Date</label>
                        <Input type="date" value={date} onChange={e => setDate(e.target.value)} required />
                      </div>
                      <div>
                        <label className="block font-medium mb-1">Select Time Slot</label>
                        <select value={timeSlot} onChange={e => setTimeSlot(e.target.value)} className="w-full border rounded p-2" required>
                          <option value="">Select a time slot</option>
                          {timeSlots.map(slot => (
                            <option key={slot} value={slot}>{slot}</option>
                          ))}
                        </select>
                      </div>
                      <Button type="submit" disabled={bookingLoading} className="w-full">
                        {bookingLoading ? 'Booking...' : 'Book Now'}
                      </Button>
                    </form>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <div><strong>Location:</strong> {ground.location}</div>
                    <div><strong>Address:</strong> {ground.address}</div>
                    <div><strong>Price per hour:</strong> ₹{ground.price_per_hour}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GroundDetail;
