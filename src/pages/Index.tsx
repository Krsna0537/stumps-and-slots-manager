
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import AboutSection from '@/components/home/AboutSection';
import FeaturedGrounds from '@/components/home/FeaturedGrounds';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <FeaturedGrounds />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
