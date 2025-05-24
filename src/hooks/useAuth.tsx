
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
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
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

      setUser(session.user);
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();
      
      const role = profile?.role || 'user';
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
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
        return;
      }

      setLoading(false);
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) {
        setUser(null);
        setUserRole(null);
        if (requiredRole) {
          navigate('/login');
        }
        return;
      }

      setUser(session.user);
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();
      
      const role = profile?.role || 'user';
      setUserRole(role);

      if (requiredRole && role !== requiredRole) {
        if (role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [requiredRole, navigate, toast]);

  return { user, userRole, loading };
};
