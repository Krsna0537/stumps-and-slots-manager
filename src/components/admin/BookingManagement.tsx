import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Calendar, Clock, MapPin, User, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const BookingManagement = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          user_profiles:user_id (first_name, last_name),
          grounds:ground_id (name, location)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        setError('Error fetching bookings.');
        setBookings([]);
      } else {
        setBookings(data || []);
      }
    } catch (error) {
      setError('Unexpected error fetching bookings.');
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: "pending" | "confirmed" | "cancelled" | "completed") => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) {
        toast({
          title: "Error",
          description: `Failed to ${newStatus} booking.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: `Booking ${newStatus} successfully!`,
        });
        fetchBookings(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: string } = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
      completed: 'bg-blue-100 text-blue-800'
    };

    return (
      <Badge className={variants[status] || 'bg-gray-100 text-gray-800'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const filteredBookings = bookings.filter(booking => 
    filterStatus === 'all' || booking.status === filterStatus
  );

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        <div className="mb-4">{error}</div>
        <Button variant="outline" onClick={fetchBookings}>
          Retry
        </Button>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-8">Loading bookings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Booking Management</h2>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Bookings</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No bookings found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredBookings.map((booking) => (
            <Card key={booking.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{booking.grounds?.name}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {booking.grounds?.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {booking.user_profiles?.first_name} {booking.user_profiles?.last_name}
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(booking.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">
                      {format(new Date(booking.booking_date), 'PPP')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-green-600" />
                    <span className="text-sm">
                      {booking.start_time} - {booking.end_time}
                    </span>
                  </div>
                  <div className="text-sm font-medium">
                    Amount: ₹{booking.total_price}
                  </div>
                </div>

                {booking.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                )}

                {booking.status === 'confirmed' && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateBookingStatus(booking.id, 'completed')}
                    >
                      Mark as Completed
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingManagement;
