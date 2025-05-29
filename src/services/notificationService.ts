
import { supabase } from '@/integrations/supabase/client';

export interface CreateNotificationParams {
  userId: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

export const createNotification = async ({
  userId,
  title,
  message,
  type
}: CreateNotificationParams) => {
  try {
    console.log('Creating notification:', { userId, title, message, type });
    
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title,
        message,
        type
      })
      .select();

    if (error) {
      console.error('Error creating notification:', error);
      return { success: false, error };
    }

    console.log('Notification created successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error creating notification:', error);
    return { success: false, error };
  }
};

export const createBookingNotification = async (
  booking: any,
  status: 'confirmed' | 'rejected',
  adminComment?: string
) => {
  console.log('Creating booking notification for:', { bookingId: booking.id, status, adminComment });
  
  const groundName = booking.grounds?.name || 'Unknown Ground';
  const bookingDate = new Date(booking.booking_date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const timeSlot = `${booking.start_time} - ${booking.end_time}`;

  let title: string;
  let message: string;
  let type: 'success' | 'error';

  if (status === 'confirmed') {
    title = 'Booking Approved ✅';
    message = `Your booking for ${groundName} on ${bookingDate}, ${timeSlot} has been approved.`;
    type = 'success';
  } else {
    title = 'Booking Rejected ❌';
    message = `Your booking for ${groundName} on ${bookingDate}, ${timeSlot} was rejected.`;
    type = 'error';
  }

  if (adminComment) {
    message += ` Admin note: ${adminComment}`;
  }

  const result = await createNotification({
    userId: booking.user_id,
    title,
    message,
    type
  });

  console.log('Booking notification result:', result);
  return result;
};
