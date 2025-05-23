
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MapPin, Star, Clock, Umbrella, Users, 
  Check, X, Calendar as CalendarIcon, Info 
} from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Mock data - would be fetched from backend in a real app
const groundDetails = {
  id: 1,
  name: 'Central Cricket Stadium',
  description: 'The Central Cricket Stadium is a premium cricket facility located in the heart of the city. It features a well-maintained pitch, modern facilities, and ample parking space. The ground is suitable for both professional matches and practice sessions.',
  location: 'Downtown, City Center',
  address: '123 Cricket Street, Downtown, City Center, 10001',
  rating: 4.8,
  reviews: 124,
  price: 150,
  mainImage: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=1000&auto=format&fit=crop',
  images: [
    'https://images.unsplash.com/photo-1562077772-3bd90403f7f0?q=80&w=500&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1627556592933-ffe99c1cd9eb?q=80&w=500&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=500&auto=format&fit=crop'
  ],
  facilities: [
    { name: 'Floodlights', available: true },
    { name: 'Electronic Scoreboard', available: true },
    { name: 'Practice Nets', available: true },
    { name: 'Changing Rooms', available: true },
    { name: 'Seating Area', available: true },
    { name: 'Parking', available: true },
    { name: 'Cafeteria', available: true },
    { name: 'Equipment Rental', available: false },
  ],
  rules: [
    'Booking must be made at least 24 hours in advance.',
    'Cancellation policy: Full refund if cancelled 48 hours before the booking.',
    'No spikes allowed on the pitch.',
    'No food or drinks allowed on the playing area.',
    'Users are responsible for any damages to the facilities.',
  ],
  openingHours: [
    { day: 'Monday', hours: '9:00 AM - 9:00 PM' },
    { day: 'Tuesday', hours: '9:00 AM - 9:00 PM' },
    { day: 'Wednesday', hours: '9:00 AM - 9:00 PM' },
    { day: 'Thursday', hours: '9:00 AM - 9:00 PM' },
    { day: 'Friday', hours: '9:00 AM - 10:00 PM' },
    { day: 'Saturday', hours: '8:00 AM - 10:00 PM' },
    { day: 'Sunday', hours: '8:00 AM - 8:00 PM' },
  ],
};

// Mock time slots - would be fetched based on the selected date
const timeSlots = [
  { id: 1, time: '9:00 AM - 11:00 AM', available: true },
  { id: 2, time: '11:00 AM - 1:00 PM', available: false },
  { id: 3, time: '1:00 PM - 3:00 PM', available: true },
  { id: 4, time: '3:00 PM - 5:00 PM', available: true },
  { id: 5, time: '5:00 PM - 7:00 PM', available: false },
  { id: 6, time: '7:00 PM - 9:00 PM', available: true },
];

const GroundDetail = () => {
  const { id } = useParams();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<number | null>(null);

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
                <BreadcrumbLink>{groundDetails.name}</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Ground header */}
          <div className="flex flex-col gap-4 mb-8">
            <h1 className="text-3xl font-bold">{groundDetails.name}</h1>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {groundDetails.location}
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span>{groundDetails.rating}</span>
                <span className="text-muted-foreground ml-1">({groundDetails.reviews} reviews)</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>2-hour slots</span>
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
                    src={groundDetails.mainImage} 
                    alt={groundDetails.name} 
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {groundDetails.images.map((image, index) => (
                    <div key={index} className="aspect-video">
                      <img 
                        src={image} 
                        alt={`${groundDetails.name} view ${index + 1}`} 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Tabs for details */}
              <Tabs defaultValue="description">
                <TabsList className="w-full grid grid-cols-4">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="facilities">Facilities</TabsTrigger>
                  <TabsTrigger value="rules">Rules</TabsTrigger>
                  <TabsTrigger value="hours">Opening Hours</TabsTrigger>
                </TabsList>

                {/* Description tab */}
                <TabsContent value="description" className="py-4">
                  <p className="text-muted-foreground">{groundDetails.description}</p>
                  <div className="mt-4">
                    <h3 className="font-semibold mb-2">Location</h3>
                    <p className="text-muted-foreground">{groundDetails.address}</p>
                    <div className="mt-4 aspect-video bg-muted rounded-lg">
                      {/* Map would be implemented here */}
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        Interactive Map Placeholder
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Facilities tab */}
                <TabsContent value="facilities" className="py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {groundDetails.facilities.map((facility, index) => (
                      <div key={index} className="flex items-center gap-2">
                        {facility.available ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <X className="h-5 w-5 text-red-500" />
                        )}
                        <span className={facility.available ? "" : "text-muted-foreground"}>
                          {facility.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Rules tab */}
                <TabsContent value="rules" className="py-4">
                  <ul className="space-y-2">
                    {groundDetails.rules.map((rule, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Info className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>

                {/* Opening hours tab */}
                <TabsContent value="hours" className="py-4">
                  <div className="space-y-2">
                    {groundDetails.openingHours.map((schedule, index) => (
                      <div key={index} className="flex justify-between pb-2 border-b">
                        <span className="font-medium">{schedule.day}</span>
                        <span className="text-muted-foreground">{schedule.hours}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right column - Booking */}
            <div>
              <div className="sticky top-24">
                <Card>
                  <CardContent className="pt-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold mb-2">Book this Ground</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">${groundDetails.price}</span>
                        <span className="text-muted-foreground">per hour</span>
                      </div>
                    </div>

                    {/* Date picker */}
                    <div className="mb-6">
                      <label className="block mb-2 font-medium">Select Date</label>
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="border rounded-md p-3 w-full pointer-events-auto"
                        disabled={(date) => {
                          // Disable past dates
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return date < today;
                        }}
                      />
                    </div>

                    {/* Time slots */}
                    <div className="mb-6">
                      <label className="block mb-2 font-medium">Select Time Slot</label>
                      <div className="grid grid-cols-2 gap-2">
                        {timeSlots.map((slot) => (
                          <Button
                            key={slot.id}
                            variant={selectedTimeSlot === slot.id ? "default" : "outline"}
                            className={!slot.available ? "opacity-50 cursor-not-allowed" : ""}
                            disabled={!slot.available}
                            onClick={() => setSelectedTimeSlot(slot.id)}
                          >
                            {slot.time}
                          </Button>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        <Clock className="inline h-4 w-4 mr-1" />
                        All slots are for 2 hours
                      </p>
                    </div>

                    {/* Booking summary */}
                    <div className="bg-muted p-4 rounded-md mb-6">
                      <h4 className="font-medium mb-2">Booking Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Date</span>
                          <span className="font-medium">{date?.toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Time</span>
                          <span className="font-medium">
                            {selectedTimeSlot 
                              ? timeSlots.find(slot => slot.id === selectedTimeSlot)?.time 
                              : "Not selected"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Duration</span>
                          <span className="font-medium">2 hours</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Price per hour</span>
                          <span className="font-medium">${groundDetails.price}</span>
                        </div>
                        <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                          <span>Total</span>
                          <span>${groundDetails.price * 2}</span>
                        </div>
                      </div>
                    </div>

                    <Button 
                      className="w-full" 
                      size="lg" 
                      disabled={!selectedTimeSlot}
                    >
                      Continue to Booking
                    </Button>
                    
                    <p className="text-xs text-muted-foreground text-center mt-4">
                      <Umbrella className="inline h-4 w-4 mr-1" />
                      Free cancellation up to 48 hours before your booking
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GroundDetail;
