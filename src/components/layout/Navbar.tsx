
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, Home, User, UserPlus, LogIn, LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        setUserRole(profile?.role || null);
      }
    };
    
    getUser();
    
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        setUserRole(profile?.role || null);
      } else {
        setUserRole(null);
      }
    });
    
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserRole(null);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-green-600" />
            <span className="text-xl font-bold">StumpsNSlots</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-6 font-medium">
          <Link to="/" className="flex items-center gap-2 text-sm hover:text-primary">
            <Home className="w-4 h-4" />
            Home
          </Link>
          <Link to="/grounds" className="flex items-center gap-2 text-sm hover:text-primary">
            <Calendar className="w-4 h-4" />
            Grounds
          </Link>
          <Link to="/contact" className="text-sm hover:text-primary">Contact</Link>
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button variant="outline" asChild>
                <Link to="/profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </Button>
              {userRole === 'admin' && (
                <Button variant="outline" asChild>
                  <Link to="/admin">
                    Admin
                  </Link>
                </Button>
              )}
              <Button variant="destructive" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link to="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Link>
              </Button>
              <Button asChild>
                <Link to="/register">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Register
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
