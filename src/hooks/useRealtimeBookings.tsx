
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Booking {
  id: string;
  user_id: string;
  ground_id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'rejected';
  total_price: number;
  created_at: string;
  updated_at: string;
  notes?: string | null;
  user_profiles?: {
    first_name: string | null;
    last_name: string | null;
  };
  grounds?: {
    name: string;
    location: string;
  };
}

export const useRealtimeBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    const fetchBookings = async () => {
      console.log('Fetching initial bookings...');
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          user_profiles:user_id (first_name, last_name),
          grounds:ground_id (name, location)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bookings:', error);
      } else {
        setBookings(data || []);
      }
      setLoading(false);
    };

    fetchBookings();

    // Set up real-time subscription
    const channel = supabase
      .channel('bookings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings'
        },
        (payload) => {
          console.log('Real-time booking update:', payload);
          
          if (payload.eventType === 'INSERT') {
            // Fetch the new booking with joined data
            supabase
              .from('bookings')
              .select(`
                *,
                user_profiles:user_id (first_name, last_name),
                grounds:ground_id (name, location)
              `)
              .eq('id', payload.new.id)
              .single()
              .then(({ data }) => {
                if (data) {
                  setBookings(prev => [data, ...prev]);
                }
              });
          } else if (payload.eventType === 'UPDATE') {
            setBookings(prev => 
              prev.map(booking => 
                booking.id === payload.new.id 
                  ? { ...booking, ...payload.new }
                  : booking
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setBookings(prev => 
              prev.filter(booking => booking.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { bookings, loading, setBookings };
};
