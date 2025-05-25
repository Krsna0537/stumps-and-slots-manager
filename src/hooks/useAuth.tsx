import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAuth = (requiredRole?: 'admin' | 'user') => {
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          setLoading(false);
          if (requiredRole) {
            // Only redirect if we're not already on the login page
            if (location.pathname !== '/login') {
              toast({
                title: "Access Denied",
                description: "Please log in to access this page.",
                variant: "destructive",
              });
              navigate('/login', { state: { from: location.pathname } });
            }
          }
          return;
        }

        setUser(session.user);
        
        const { data: userProfile, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
          if (error.code === 'PGRST116') {
            setUserRole('user');
          } else {
            console.error('Error fetching user profile:', error);
            setUserRole('user');
          }
        } else {
          const isAdmin = userProfile?.is_admin;
          const role = isAdmin === true ? 'admin' : 'user';
          setUserRole(role);

          // Check role requirements
          if (requiredRole && role !== requiredRole) {
            toast({
              title: "Access Denied",
              description: `You need ${requiredRole} privileges to access this page.`,
              variant: "destructive",
            });
            
            // Redirect based on actual role
            if (role === 'admin') {
              navigate('/admin', { replace: true });
            } else {
              navigate('/dashboard', { replace: true });
            }
          }
        }

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
          setUser(null);
          setUserRole(null);
          if (requiredRole) {
            // Only redirect if we're not already on the login page
            if (location.pathname !== '/login') {
              navigate('/login', { state: { from: location.pathname } });
            }
          }
          return;
        }

        setUser(session.user);
        
        const { data: userProfile, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
          if (error.code === 'PGRST116') {
            setUserRole('user');
          } else {
            console.error('Error fetching user profile:', error);
            setUserRole('user');
          }
        } else {
          const isAdmin = userProfile?.is_admin;
          const role = isAdmin === true ? 'admin' : 'user';
          setUserRole(role);

          // Check role requirements
          if (requiredRole && role !== requiredRole) {
            if (role === 'admin') {
              navigate('/admin', { replace: true });
            } else {
              navigate('/dashboard', { replace: true });
            }
          }
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [requiredRole, navigate, location, toast]);

  return { user, userRole, loading };
};
