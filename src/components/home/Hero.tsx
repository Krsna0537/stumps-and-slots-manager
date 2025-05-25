import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, CheckCircle, LogIn } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';

const Hero = () => {
  const navigate = useNavigate();

  const handleBrowseGrounds = () => {
    navigate('/grounds');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div
      className="relative bg-cover bg-center"
      style={{ backgroundImage: "url('/cric.jpg')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 opacity-70 z-0" />
      <motion.div 
        className="container flex flex-col items-center py-16 md:py-32 text-center relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Calendar className="h-12 w-12 text-green-600 mb-6" />
        </motion.div>
        <motion.h1 
          className="text-4xl md:text-6xl font-bold tracking-tight mb-4" 
          style={{ textShadow: '0 2px 8px rgba(0,0,0,0.25)' }}
          variants={itemVariants}
        >
          Cricket Ground Reservation System
        </motion.h1>
        <motion.p 
          className="text-xl md:text-2xl text-muted-foreground max-w-3xl mb-8" 
          style={{ textShadow: '0 1px 6px rgba(0,0,0,0.18)' }}
          variants={itemVariants}
        >
          Book your perfect cricket ground for matches or practice sessions with just a few clicks
        </motion.p>

        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          {/* Removed Browse Grounds, Sign In, and Create Account buttons */}
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 max-w-4xl"
          variants={containerVariants}
        >
          <motion.div 
            className="flex flex-col items-center"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="bg-green-100 dark:bg-green-900/40 p-3 rounded-full mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Easy Booking</h3>
            <p className="text-sm text-muted-foreground">
              Simple booking process with real-time availability check
            </p>
          </motion.div>
          <motion.div 
            className="flex flex-col items-center"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="bg-green-100 dark:bg-green-900/40 p-3 rounded-full mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Top Grounds</h3>
            <p className="text-sm text-muted-foreground">
              Access to quality cricket grounds in your area
            </p>
          </motion.div>
          <motion.div 
            className="flex flex-col items-center"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="bg-green-100 dark:bg-green-900/40 p-3 rounded-full mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Secure Payments</h3>
            <p className="text-sm text-muted-foreground">
              Safe and secure online payment system
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Hero;
