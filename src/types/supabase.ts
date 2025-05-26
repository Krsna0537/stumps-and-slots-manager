
// Extended types for missing database tables and updated enums
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'rejected';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  is_read: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Review {
  id: string;
  ground_id: string;
  user_id: string;
  rating: number;
  comment?: string | null;
  created_at: string;
  updated_at: string;
  user_profiles?: {
    first_name: string;
    last_name: string;
  };
}

export interface ExtendedUserProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  is_admin?: boolean;
  created_at?: string;
}
