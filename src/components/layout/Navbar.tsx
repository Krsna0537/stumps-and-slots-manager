
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, Home, User, UserPlus, LogIn } from 'lucide-react';

const Navbar = () => {
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
          <Link to="/about" className="text-sm hover:text-primary">About</Link>
          <Link to="/contact" className="text-sm hover:text-primary">Contact</Link>
        </nav>

        <div className="flex items-center gap-2">
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
        </div>
      </div>
    </header>
  );
};

export default Navbar;
