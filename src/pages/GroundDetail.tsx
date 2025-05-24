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

const GroundDetail = () => {
  const { id } = useParams();
  const [ground, setGround] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState<string>("");
  const [timeSlot, setTimeSlot] = useState<string>("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

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

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError("");
    setBookingSuccess("");
    if (!user) {
      setBookingError("You must be logged in to book a ground.");
      return;
    }
    if (!date || !timeSlot) {
      setBookingError("Please select a date and time slot.");
      return;
    }
    setBookingLoading(true);
    const { error } = await supabase.from('bookings').insert({
      ground_id: ground.id,
      user_id: user.id,
      user_email: user.email,
      date,
      time_slot: timeSlot
    });
    setBookingLoading(false);
    if (error) {
      setBookingError(error.message);
    } else {
      setBookingSuccess("Booking successful!");
      setDate("");
      setTimeSlot("");
      setTimeout(() => setBookingSuccess(""), 2000);
    }
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
                <span>{ground.rating ? ground.rating : 'N/A'}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>Price: ₹{ground.price_per_hour}</span>
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
                {/* If you have multiple images, map them here. Otherwise, show only the main image. */}
              </div>

              {/* Tabs for details */}
              <Tabs defaultValue="description">
                <TabsList className="w-full grid grid-cols-1">
                  <TabsTrigger value="description">Description</TabsTrigger>
                </TabsList>
                {/* Description tab */}
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
                      {bookingError && <div className="text-red-600 text-sm">{bookingError}</div>}
                      {bookingSuccess && <div className="text-green-600 text-sm">{bookingSuccess}</div>}
                      <Button type="submit" disabled={bookingLoading}>{bookingLoading ? 'Booking...' : 'Book Now'}</Button>
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
