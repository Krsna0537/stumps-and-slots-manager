
// Define notification types since they're not in the auto-generated database types yet
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
