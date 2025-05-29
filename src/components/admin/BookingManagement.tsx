import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Calendar, Clock, MapPin, User, Filter, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRealtimeBookings } from '@/hooks/useRealtimeBookings';
import { AccessibilityWrapper, useKeyboardNavigation } from '@/components/accessibility/AccessibilityWrapper';
import { createBookingNotification } from '@/services/notificationService';

// Define the booking status type based on the database enum
type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'rejected';

const BookingManagement = () => {
  const { bookings, loading, setBookings } = useRealtimeBookings();
  const [filterStatus, setFilterStatus] = useState('all');
  const [updatingBookings, setUpdatingBookings] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  const updateBookingStatus = async (bookingId: string, newStatus: BookingStatus, adminComment?: string) => {
    console.log(`Updating booking ${bookingId} to status: ${newStatus}`);
    
    // Add to updating set to show loading state
    setUpdatingBookings(prev => new Set(prev).add(bookingId));
    
    try {
      // Find the booking to get user info for notification
      const bookingToUpdate = bookings.find(b => b.id === bookingId);
      
      const { data, error } = await supabase
        .from('bookings')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString(),
          ...(adminComment && { notes: adminComment })
        })
        .eq('id', bookingId)
        .select();

      if (error) {
        console.error('Error updating booking:', error);
        toast({
          title: "Error",
          description: `Failed to ${newStatus} booking: ${error.message}`,
          variant: "destructive",
        });
      } else {
        console.log('Booking updated successfully:', data);
        
        // Send notification to user if status is confirmed or rejected
        if (bookingToUpdate && (newStatus === 'confirmed' || newStatus === 'rejected')) {
          try {
            await createBookingNotification(bookingToUpdate, newStatus, adminComment);
            console.log('Notification sent to user');
          } catch (notificationError) {
            console.error('Error sending notification:', notificationError);
          }
        }
        
        toast({
          title: "Success",
          description: `Booking ${newStatus} successfully!`,
        });
        
        // Update local state immediately for better UX (real-time will also update)
        setBookings(prevBookings => 
          prevBookings.map(booking => 
            booking.id === bookingId 
              ? { 
                  ...booking, 
                  status: newStatus, 
                  updated_at: new Date().toISOString(),
                  ...(adminComment && { notes: adminComment })
                }
              : booking
          )
        );
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

  // Keyboard navigation for accessibility
  useKeyboardNavigation(
    undefined, // onEnter
    () => setFilterStatus('all'), // onEscape - reset filter
    undefined, // onArrowUp
    undefined  // onArrowDown
  );

  if (error) {
    return (
      <AccessibilityWrapper 
        announceOnMount="Error loading bookings"
        ariaLabel="Booking management error"
      >
        <div className="space-y-4">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </AccessibilityWrapper>
    );
  }

  if (loading) {
    return (
      <AccessibilityWrapper 
        announceOnMount="Loading bookings"
        ariaLabel="Loading booking management"
      >
        <div className="text-center py-8">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" aria-hidden="true" />
          <p>Loading bookings...</p>
        </div>
      </AccessibilityWrapper>
    );
  }

  return (
    <AccessibilityWrapper 
      announceOnMount={`${filteredBookings.length} bookings loaded`}
      ariaLabel="Booking management dashboard"
      role="main"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold" id="booking-management-title">
            Booking Management
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" aria-hidden="true" />
              <Select 
                value={filterStatus} 
                onValueChange={setFilterStatus}
                aria-label="Filter bookings by status"
              >
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
          <div className="grid gap-4" role="list" aria-labelledby="booking-management-title">
            {filteredBookings.map((booking) => {
              const isUpdating = updatingBookings.has(booking.id);
              
              return (
                <Card key={booking.id} className="overflow-hidden" role="listitem">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {booking.grounds?.name || 'Unknown Ground'}
                        </CardTitle>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" aria-hidden="true" />
                            <span aria-label="Location">{booking.grounds?.location || 'Unknown Location'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" aria-hidden="true" />
                            <span aria-label="Customer">
                              {booking.user_profiles?.first_name} {booking.user_profiles?.last_name}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isUpdating && (
                          <RefreshCw 
                            className="h-4 w-4 animate-spin text-gray-400" 
                            aria-label="Updating booking status"
                          />
                        )}
                        {getStatusBadge(booking.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-600" aria-hidden="true" />
                        <span className="text-sm" aria-label="Booking date">
                          {format(new Date(booking.booking_date), 'PPP')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-green-600" aria-hidden="true" />
                        <span className="text-sm" aria-label="Time slot">
                          {booking.start_time} - {booking.end_time}
                        </span>
                      </div>
                      <div className="text-sm font-medium" aria-label="Total amount">
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
                      <div className="flex gap-2" role="group" aria-label="Booking actions">
                        <Button
                          size="sm"
                          onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                          className="bg-green-600 hover:bg-green-700"
                          disabled={isUpdating}
                          aria-label="Approve booking"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" aria-hidden="true" />
                          {isUpdating ? 'Updating...' : 'Approve'}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateBookingStatus(booking.id, 'rejected')}
                          disabled={isUpdating}
                          aria-label="Reject booking"
                        >
                          <XCircle className="h-4 w-4 mr-1" aria-hidden="true" />
                          {isUpdating ? 'Updating...' : 'Reject'}
                        </Button>
                      </div>
                    )}

                    {booking.status === 'confirmed' && (
                      <div className="flex gap-2" role="group" aria-label="Booking actions">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateBookingStatus(booking.id, 'completed')}
                          disabled={isUpdating}
                          aria-label="Mark booking as completed"
                        >
                          {isUpdating ? 'Updating...' : 'Mark as Completed'}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                          disabled={isUpdating}
                          aria-label="Cancel booking"
                        >
                          <XCircle className="h-4 w-4 mr-1" aria-hidden="true" />
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
    </AccessibilityWrapper>
  );
};

export default BookingManagement;
