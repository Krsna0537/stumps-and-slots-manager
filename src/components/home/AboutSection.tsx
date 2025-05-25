import React from 'react';
import { ShieldCheck, Headset, Rocket, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const features = [
  {
    icon: <ShieldCheck className="h-8 w-8 text-green-600" />,
    title: 'Secure & Reliable',
    desc: 'Your bookings and payments are protected with industry-leading security and privacy standards.'
  },
  {
    icon: <Headset className="h-8 w-8 text-blue-600" />,
    title: '24/7 Support',
    desc: 'Our dedicated support team is always available to help you with any queries or issues.'
  },
  {
    icon: <Rocket className="h-8 w-8 text-amber-600" />,
    title: 'Fast & Easy',
    desc: 'Book your cricket ground in seconds with our intuitive and user-friendly platform.'
  },
  {
    icon: <Users className="h-8 w-8 text-purple-600" />,
    title: 'Community Driven',
    desc: 'Join a growing community of cricket enthusiasts, clubs, and teams across the region.'
  },
];

const AboutSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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
    <section className="relative py-20 bg-gradient-to-br from-green-50 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 overflow-hidden">
      {/* Background image with low opacity */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none" style={{background: 'url(/grd.png) center/cover no-repeat', opacity: 0.18}} />
      {/* Vignette overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none select-none" style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.08) 40%, rgba(0,0,0,0.08) 60%, rgba(0,0,0,0.18) 100%)'}} />
      <motion.div 
        className="container relative z-10 max-w-4xl mx-auto text-center"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.h2 
          className="text-4xl md:text-5xl font-extrabold mb-4 text-green-800 dark:text-green-200 drop-shadow-lg"
          variants={itemVariants}
        >
          Why Choose StumpsNSlots?
        </motion.h2>
        <motion.p 
          className="text-xl md:text-2xl text-muted-foreground mb-10 font-medium"
          variants={itemVariants}
        >
          A professional platform for seamless cricket ground reservations, trusted by clubs, teams, and players.
        </motion.p>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10"
          variants={containerVariants}
        >
          {features.map((feature, idx) => (
            <motion.div 
              key={idx} 
              className="flex flex-col items-center bg-white/90 dark:bg-background/80 rounded-xl shadow-lg p-8 border border-green-100 dark:border-green-900/30"
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div 
                className="mb-4"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                {feature.icon}
              </motion.div>
              <h4 className="text-xl font-semibold mb-2 text-foreground">{feature.title}</h4>
              <p className="text-muted-foreground text-base">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <Button 
              size="lg" 
              className="bg-green-700 hover:bg-green-800 text-white shadow-xl px-8 py-4 text-lg font-bold rounded-full transition-all duration-200" 
              asChild
            >
              <Link to="/register">Join Now</Link>
            </Button>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Button 
              size="lg" 
              variant="outline" 
              className="px-8 py-4 text-lg font-bold rounded-full transition-all duration-200" 
              asChild
            >
              <Link to="/login">Sign In</Link>
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default AboutSection; 