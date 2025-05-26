
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, Home, User, UserPlus, LogIn, LogOut, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ExtendedUserProfile } from '@/types/supabase';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const { data: userProfile, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (error) {
            console.error('Error fetching user profile:', error);
            setUserRole('user');
          } else {
            const profile = userProfile as ExtendedUserProfile;
            const isAdmin = profile?.is_admin;
            setUserRole(isAdmin === true ? 'admin' : 'user');
          }
        } else {
          setUserRole(null);
        }
      } catch (error) {
        console.error('Error in getUser:', error);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };
    
    getUser();
    
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        try {
          const { data: userProfile, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (error) {
            console.error('Error fetching user profile:', error);
            setUserRole('user');
          } else {
            const profile = userProfile as ExtendedUserProfile;
            const isAdmin = profile?.is_admin;
            setUserRole(isAdmin === true ? 'admin' : 'user');
          }
        } catch (error) {
          console.error('Error in auth state change:', error);
          setUserRole(null);
        }
      } else {
        setUserRole(null);
      }
    });
    
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setUserRole(null);
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error during logout:', error);
      toast({
        title: "Logout Error",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <Calendar className="h-6 w-6 text-green-600" />
              <span className="text-xl font-bold">StumpsNSlots</span>
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to={user ? (userRole === 'admin' ? "/admin" : "/dashboard") : "/"} className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-green-600" />
            <span className="text-xl font-bold">StumpsNSlots</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {!user ? (
            <>
              <Link to="/grounds" className="flex items-center gap-2 text-sm hover:text-primary">
                <Calendar className="w-4 h-4" />
                Grounds
              </Link>
              <Link to="/contact" className="text-sm hover:text-primary">Contact</Link>
            </>
          ) : userRole === 'admin' ? (
            <>
              <Link to="/admin" className="flex items-center gap-2 text-sm hover:text-primary">
                <Shield className="w-4 h-4" />
                Admin Dashboard
              </Link>
              <Link to="/grounds" className="flex items-center gap-2 text-sm hover:text-primary">
                <Calendar className="w-4 h-4" />
                Manage Grounds
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="flex items-center gap-2 text-sm hover:text-primary">
                <Home className="w-4 h-4" />
                Dashboard
              </Link>
              <Link to="/grounds" className="flex items-center gap-2 text-sm hover:text-primary">
                <Calendar className="w-4 h-4" />
                Browse Grounds
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {!user ? (
            <>
              <Button variant="ghost" asChild>
                <Link to="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Link>
              </Button>
              <Button asChild>
                <Link to="/register">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign Up
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link to="/profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </Button>
              <Button variant="destructive" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
              {userRole === 'admin' && (
                <div className="ml-2 px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                  Admin
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
