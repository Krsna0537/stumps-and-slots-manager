import React from 'react';
import { motion } from 'framer-motion';
import { Github, Mail, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const Contact = () => {
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-16">
        <motion.div 
          className="container max-w-4xl mx-auto px-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="text-center mb-12"
            variants={itemVariants}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Our Team
            </h1>
            <p className="text-xl text-muted-foreground">
              Meet the developers behind StumpsNSlots
            </p>
          </motion.div>

          <motion.div 
            className="bg-white dark:bg-background/80 rounded-2xl shadow-xl p-8 mb-12 border border-green-100 dark:border-green-900/30"
            variants={itemVariants}
          >
            <div className="flex items-center gap-3 mb-6">
              <Users className="h-8 w-8 text-green-600" />
              <h2 className="text-2xl font-semibold">Team Members</h2>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-lg font-medium">Prasanna Mesta</p>
                <p className="text-muted-foreground">1VE23CY037</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-lg font-medium">Niranjan S</p>
                <p className="text-muted-foreground">1VE23CY033</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-lg font-medium">Niranjan S</p>
                <p className="text-muted-foreground">1VE23CY034</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-lg font-medium">Gurudeep M R</p>
                <p className="text-muted-foreground">1VE23CY018</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={containerVariants}
          >
            <motion.div 
              className="bg-white dark:bg-background/80 rounded-2xl shadow-xl p-8 border border-green-100 dark:border-green-900/30"
              variants={itemVariants}
            >
              <div className="flex items-center gap-3 mb-6">
                <Github className="h-8 w-8 text-green-600" />
                <h2 className="text-2xl font-semibold">GitHub Repository</h2>
              </div>
              <a 
                href="https://github.com/Krsna0537/stumps-and-slots-manager.git"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 break-all"
              >
                https://github.com/Krsna0537/stumps-and-slots-manager.git
              </a>
            </motion.div>

            <motion.div 
              className="bg-white dark:bg-background/80 rounded-2xl shadow-xl p-8 border border-green-100 dark:border-green-900/30"
              variants={itemVariants}
            >
              <div className="flex items-center gap-3 mb-6">
                <Mail className="h-8 w-8 text-green-600" />
                <h2 className="text-2xl font-semibold">Contact Email</h2>
              </div>
              <a 
                href="mailto:pmesta246@gmail.com"
                className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
              >
                pmesta246@gmail.com
              </a>
            </motion.div>
          </motion.div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
