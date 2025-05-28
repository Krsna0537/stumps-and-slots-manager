
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Calendar, Clock, MapPin, User, Filter, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Define the booking status type based on the database enum
type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'rejected';

interface Booking {
  id: string;
  user_id: string;
  ground_id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: BookingStatus;
  total_price: number;
  created_at: string;
  updated_at: string;
  user_email?: string;
  time_slot?: string;
  date?: string;
  notes?: string;
  user_profiles?: {
    first_name: string | null;
    last_name: string | null;
  };
  grounds?: {
    name: string;
    location: string;
  };
}

const BookingManagement = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [updatingBookings, setUpdatingBookings] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    console.log('Fetching bookings...');
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

      console.log('Bookings fetch result:', { data, error });

      if (error) {
        console.error('Error fetching bookings:', error);
        setError(`Error fetching bookings: ${error.message}`);
        setBookings([]);
        toast({
          title: "Error",
          description: `Failed to fetch bookings: ${error.message}`,
          variant: "destructive",
        });
      } else {
        console.log(`Successfully fetched ${data?.length || 0} bookings`);
        setBookings(data || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setError('Unexpected error fetching bookings.');
      setBookings([]);
      toast({
        title: "Error",
        description: "An unexpected error occurred while fetching bookings.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: BookingStatus) => {
    console.log(`Updating booking ${bookingId} to status: ${newStatus}`);
    
    // Add to updating set to show loading state
    setUpdatingBookings(prev => new Set(prev).add(bookingId));
    
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId)
        .select();

      console.log('Update result:', { data, error });

      if (error) {
        console.error('Error updating booking:', error);
        toast({
          title: "Error",
          description: `Failed to ${newStatus} booking: ${error.message}`,
          variant: "destructive",
        });
      } else {
        console.log('Booking updated successfully:', data);
        toast({
          title: "Success",
          description: `Booking ${newStatus} successfully!`,
        });
        
        // Update the local state immediately for better UX
        setBookings(prevBookings => 
          prevBookings.map(booking => 
            booking.id === bookingId 
              ? { ...booking, status: newStatus, updated_at: new Date().toISOString() }
              : booking
          )
        );
        
        // Refresh the list to ensure consistency
        setTimeout(() => {
          fetchBookings();
        }, 500);
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while updating the booking.",
        variant: "destructive",
      });
    } finally {
      // Remove from updating set
      setUpdatingBookings(prev => {
        const newSet = new Set(prev);
        newSet.delete(bookingId);
        return newSet;
      });
    }
  };

  const getStatusBadge = (status: BookingStatus) => {
    const variants: { [key in BookingStatus]: string } = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      confirmed: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
      cancelled: 'bg-gray-100 text-gray-800 border-gray-200',
      completed: 'bg-blue-100 text-blue-800 border-blue-200'
    };

    return (
      <Badge className={`${variants[status]} border`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const filteredBookings = bookings.filter(booking => 
    filterStatus === 'all' || booking.status === filterStatus
  );

  if (error) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="text-center">
          <Button variant="outline" onClick={fetchBookings} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
        <p>Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Booking Management</h2>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchBookings}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
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
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              {filterStatus === 'all' ? 'No bookings found.' : `No ${filterStatus} bookings found.`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredBookings.map((booking) => {
            const isUpdating = updatingBookings.has(booking.id);
            
            return (
              <Card key={booking.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {booking.grounds?.name || 'Unknown Ground'}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {booking.grounds?.location || 'Unknown Location'}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {booking.user_profiles?.first_name} {booking.user_profiles?.last_name}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isUpdating && <RefreshCw className="h-4 w-4 animate-spin text-gray-400" />}
                      {getStatusBadge(booking.status)}
                    </div>
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

                  {booking.notes && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Notes:</strong> {booking.notes}
                      </p>
                    </div>
                  )}

                  {booking.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                        className="bg-green-600 hover:bg-green-700"
                        disabled={isUpdating}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        {isUpdating ? 'Updating...' : 'Approve'}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => updateBookingStatus(booking.id, 'rejected')}
                        disabled={isUpdating}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        {isUpdating ? 'Updating...' : 'Reject'}
                      </Button>
                    </div>
                  )}

                  {booking.status === 'confirmed' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateBookingStatus(booking.id, 'completed')}
                        disabled={isUpdating}
                      >
                        {isUpdating ? 'Updating...' : 'Mark as Completed'}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                        disabled={isUpdating}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        {isUpdating ? 'Updating...' : 'Cancel'}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BookingManagement;
