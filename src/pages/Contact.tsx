import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Mail, Github, Users, User } from 'lucide-react';

const team = [
  { name: 'Prasanna Mesta', usn: '1VE23CY037' },
  { name: 'Niranjan S', usn: '1VE23CY033' },
  { name: 'Niranjan S', usn: '1VE23CY034' },
  { name: 'Gurudeep M R', usn: '1VE23CY018' },
];

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
        <div className="container max-w-2xl mx-auto p-6 bg-white dark:bg-background rounded-lg shadow-md border">
          <div className="flex flex-col items-center mb-8">
            <Users className="h-12 w-12 text-green-600 mb-2" />
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-center">Contact Us</h1>
            <p className="text-lg text-muted-foreground text-center mb-4">We are the team behind StumpsNSlots. Reach out to us for any queries or feedback!</p>
          </div>
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><User className="h-5 w-5 text-green-500" /> Team Members</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {team.map((member, idx) => (
                <li key={idx} className="p-4 rounded-lg bg-green-50 dark:bg-green-900/10 flex flex-col items-center border border-green-100 dark:border-green-900/30">
                  <span className="font-semibold text-lg text-green-800 dark:text-green-200">{member.name}</span>
                  <span className="text-sm text-muted-foreground">{member.usn}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-6 flex flex-col md:flex-row gap-6 justify-center items-center">
            <a href="https://github.com/Krsna0537/cricket-arena-pro.git" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-base font-medium text-green-700 hover:underline">
              <Github className="h-5 w-5" /> GitHub Repository
            </a>
            <a href="mailto:pmesta246@gmail.com" className="flex items-center gap-2 text-base font-medium text-green-700 hover:underline">
              <Mail className="h-5 w-5" /> pmesta246@gmail.com
            </a>
          </div>
          <div className="flex justify-center mt-8">
            <img src="/cric.jpg" alt="Cricket" className="h-32 w-auto rounded-xl shadow-lg border-2 border-green-200" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact; 