
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAuth = (requiredRole?: 'admin' | 'user') => {
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          console.log('No session found');
          setLoading(false);
          if (requiredRole) {
            toast({
              title: "Access Denied",
              description: "Please log in to access this page.",
              variant: "destructive",
            });
            navigate('/login');
          }
          return;
        }

        console.log('Session user:', session.user);
        setUser(session.user);
        
        // Check user_profiles table for is_admin flag
        const { data: userProfile, error } = await supabase
          .from('user_profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();
        
        console.log('User profile query result:', { userProfile, error });
        
        if (error) {
          console.error('Error fetching user profile:', error);
          // Fallback to regular user if profile not found
          const role = 'user';
          setUserRole(role);
        } else {
          // Convert boolean to role string
          const isAdmin = userProfile?.is_admin;
          console.log('is_admin value:', isAdmin, 'type:', typeof isAdmin);
          
          const role = isAdmin === true ? 'admin' : 'user';
          console.log('Determined role:', role);
          setUserRole(role);
        }

        // Check role requirements after setting userRole
        setTimeout(() => {
          const currentRole = userProfile?.is_admin === true ? 'admin' : 'user';
          console.log('Checking role requirements:', { requiredRole, currentRole });
          
          if (requiredRole && currentRole !== requiredRole) {
            console.log('Role mismatch, redirecting...');
            toast({
              title: "Access Denied",
              description: `You need ${requiredRole} privileges to access this page.`,
              variant: "destructive",
            });
            
            // Redirect based on actual role
            if (currentRole === 'admin') {
              navigate('/admin');
            } else {
              navigate('/dashboard');
            }
            return;
          }
        }, 100);

        setLoading(false);
      } catch (error) {
        console.error('Error in getUser:', error);
        setLoading(false);
      }
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        if (!session?.user) {
          console.log('Auth state change: No user');
          setUser(null);
          setUserRole(null);
          if (requiredRole) {
            navigate('/login');
          }
          return;
        }

        console.log('Auth state change: User found:', session.user);
        setUser(session.user);
        
        const { data: userProfile, error } = await supabase
          .from('user_profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();
        
        console.log('Auth state change - User profile:', { userProfile, error });
        
        if (error) {
          console.error('Auth state change - Error fetching user profile:', error);
          setUserRole('user');
        } else {
          const isAdmin = userProfile?.is_admin;
          console.log('Auth state change - is_admin value:', isAdmin, 'type:', typeof isAdmin);
          
          const role = isAdmin === true ? 'admin' : 'user';
          console.log('Auth state change - Determined role:', role);
          setUserRole(role);
        }

        // Check role requirements
        setTimeout(() => {
          const currentRole = userProfile?.is_admin === true ? 'admin' : 'user';
          if (requiredRole && currentRole !== requiredRole) {
            if (currentRole === 'admin') {
              navigate('/admin');
            } else {
              navigate('/dashboard');
            }
          }
        }, 100);
      } catch (error) {
        console.error('Error in auth state change:', error);
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [requiredRole, navigate, toast]);

  return { user, userRole, loading };
};
