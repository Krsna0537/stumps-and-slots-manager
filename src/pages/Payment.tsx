
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, CreditCard, Banknote, Smartphone } from 'lucide-react';
import { format } from 'date-fns';

const Payment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const bookingDetails = state?.bookingDetails;

  if (!bookingDetails) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow text-center">
        <h2 className="text-2xl font-bold mb-4">No Booking Details</h2>
        <p className="mb-4">Please start your booking again.</p>
        <Button onClick={() => navigate('/grounds')}>Go to Grounds</Button>
      </div>
    );
  }

  // Helper function to parse time slot and extract start_time and end_time
  const parseTimeSlot = (timeSlot: string) => {
    // Assuming time_slot format is "HH:MM - HH:MM" (e.g., "09:00 - 10:00")
    const [startTime, endTime] = timeSlot.split(' - ');
    return {
      start_time: startTime,
      end_time: endTime
    };
  };

  const handleConfirmPayment = async () => {
    setLoading(true);
    setError('');
    try {
      // Parse the time slot to get start_time and end_time
      const { start_time, end_time } = parseTimeSlot(bookingDetails.time_slot);

      // 1. Create booking
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          ground_id: bookingDetails.ground_id,
          user_id: bookingDetails.user_id,
          booking_date: bookingDetails.date,
          date: bookingDetails.date,
          time_slot: bookingDetails.time_slot,
          start_time: start_time,
          end_time: end_time,
          total_price: bookingDetails.total_price,
          status: 'confirmed',
        })
        .select()
        .single();

      if (bookingError || !booking) {
        console.error('Booking error:', bookingError);
        setError('Failed to create booking. Please try again.');
        setLoading(false);
        return;
      }

      setBookingId(booking.id);

      // 2. Create payment
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          booking_id: booking.id,
          amount: bookingDetails.total_price,
          status: 'completed',
          payment_method: paymentMethod,
          transaction_id: `TXN${Date.now()}`
        });

      if (paymentError) {
        console.error('Payment error:', paymentError);
        setError('Failed to record payment. Please contact support.');
        setLoading(false);
        return;
      }

      setShowSuccess(true);
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewBooking = () => {
    navigate('/profile', { state: { paymentSuccess: true, bookingId } });
  };

  const paymentMethods = [
    { id: 'UPI', label: 'UPI', icon: <Smartphone className="w-6 h-6" /> },
    { id: 'Card', label: 'Credit/Debit Card', icon: <CreditCard className="w-6 h-6" /> },
    { id: 'Netbanking', label: 'Net Banking', icon: <Banknote className="w-6 h-6" /> },
  ];

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Complete Your Booking</h2>
        
        {/* Booking Summary */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-3">Booking Summary</h3>
          <div className="space-y-2">
            <p><span className="font-medium">Ground:</span> {bookingDetails.ground_name}</p>
            <p><span className="font-medium">Date:</span> {format(new Date(bookingDetails.date), 'PPP')}</p>
            <p><span className="font-medium">Time Slot:</span> {bookingDetails.time_slot}</p>
            <p><span className="font-medium">Total Amount:</span> ₹{bookingDetails.total_price}</p>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Select Payment Method</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  paymentMethod === method.id
                    ? 'border-primary bg-primary/5'
                    : 'hover:border-primary/50'
                }`}
                onClick={() => setPaymentMethod(method.id)}
              >
                <div className="flex items-center space-x-3">
                  {method.icon}
                  <span>{method.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        <Button
          onClick={handleConfirmPayment}
          disabled={loading || !paymentMethod}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing Payment...
            </>
          ) : (
            'Confirm Payment'
          )}
        </Button>
      </Card>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Successful!</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-4">Your booking has been confirmed and payment has been processed successfully.</p>
            <div className="space-y-2">
              <p><span className="font-medium">Booking ID:</span> {bookingId}</p>
              <p><span className="font-medium">Amount Paid:</span> ₹{bookingDetails.total_price}</p>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => navigate('/grounds')}>
              Book Another Ground
            </Button>
            <Button onClick={handleViewBooking}>
              View Booking
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Payment;
