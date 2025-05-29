
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Check, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Notification } from '@/types/supabase';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    fetchNotifications();
    
    // Set up real-time subscription for new notifications
    const channel = supabase
      .channel('notifications')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        (payload) => {
          fetchNotifications();
          if (payload.new && typeof payload.new === 'object') {
            const newNotification = payload.new as any;
            toast({
              title: newNotification.title,
              description: newNotification.message,
            });
          }
        }
      )
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'notifications' },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  const fetchNotifications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Use direct query and cast the result
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notifications:', error);
      } else {
        const notificationData = (data || []) as Notification[];
        setNotifications(notificationData);
        setUnreadCount(notificationData.filter((n: Notification) => !n.is_read).length);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) {
        console.error('Error marking notification as read:', error);
      } else {
        fetchNotifications();
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) {
        console.error('Error marking all notifications as read:', error);
      } else {
        fetchNotifications();
        toast({
          title: "Success",
          description: "All notifications marked as read.",
        });
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const getTypeIcon = (type: Notification['type']) => {
    const iconProps = { className: "h-5 w-5" };
    
    switch (type) {
      case 'success':
        return <CheckCircle {...iconProps} className="h-5 w-5 text-green-600" />;
      case 'error':
        return <XCircle {...iconProps} className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle {...iconProps} className="h-5 w-5 text-yellow-600" />;
      case 'info':
        return <Info {...iconProps} className="h-5 w-5 text-blue-600" />;
      default:
        return <Info {...iconProps} className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTypeColor = (type: Notification['type']) => {
    const colors: Record<Notification['type'], string> = {
      success: 'bg-green-100 text-green-800 border-green-200',
      error: 'bg-red-100 text-red-800 border-red-200',
      warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      info: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return colors[type];
  };

  const getCardBorderColor = (type: Notification['type']) => {
    const colors: Record<Notification['type'], string> = {
      success: 'border-l-green-500',
      error: 'border-l-red-500',
      warning: 'border-l-yellow-500',
      info: 'border-l-blue-500'
    };
    return colors[type];
  };

  if (loading) {
    return <div className="text-center py-4">Loading notifications...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {unreadCount}
            </Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <Check className="h-4 w-4 mr-1" />
            Mark All Read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No notifications yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`transition-all border-l-4 ${getCardBorderColor(notification.type)} ${
                !notification.is_read ? 'bg-blue-50/50 border-blue-200' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getTypeIcon(notification.type)}
                      <div className="flex items-center gap-2 flex-1">
                        <h4 className="font-medium text-gray-900">{notification.title}</h4>
                        <Badge className={`${getTypeColor(notification.type)} border text-xs`}>
                          {notification.type}
                        </Badge>
                        {!notification.is_read && (
                          <Badge variant="destructive" className="text-xs">
                            New
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(notification.created_at), 'PPp')}
                    </p>
                  </div>
                  {!notification.is_read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markAsRead(notification.id)}
                      className="ml-4"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
