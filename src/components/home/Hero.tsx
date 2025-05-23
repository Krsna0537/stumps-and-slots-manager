
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, CheckCircle } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative">
      <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
        <div className="container flex flex-col items-center py-12 md:py-24 text-center">
          <Calendar className="h-12 w-12 text-green-600 mb-6" />
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            Cricket Ground Reservation System
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mb-8">
            Book your perfect cricket ground for matches or practice sessions with just a few clicks
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button size="lg" asChild>
              <Link to="/grounds">
                Browse Grounds
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/register">
                Create Account
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 max-w-4xl">
            <div className="flex flex-col items-center">
              <div className="bg-green-100 dark:bg-green-900/40 p-3 rounded-full mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Easy Booking</h3>
              <p className="text-sm text-muted-foreground">
                Simple booking process with real-time availability check
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-green-100 dark:bg-green-900/40 p-3 rounded-full mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Top Grounds</h3>
              <p className="text-sm text-muted-foreground">
                Access to quality cricket grounds in your area
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-green-100 dark:bg-green-900/40 p-3 rounded-full mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure Payments</h3>
              <p className="text-sm text-muted-foreground">
                Safe and secure online payment system
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
