
import React from 'react';
import { Search, Calendar, CreditCard, CheckCircle } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: 'Find a Ground',
    description: 'Search and browse through our collection of cricket grounds',
    icon: Search,
  },
  {
    id: 2,
    title: 'Select Date & Time',
    description: 'Choose your preferred date and time slot for booking',
    icon: Calendar,
  },
  {
    id: 3,
    title: 'Make Payment',
    description: 'Secure your booking by making the payment online',
    icon: CreditCard,
  },
  {
    id: 4,
    title: 'Confirmation',
    description: 'Receive instant confirmation for your booking',
    icon: CheckCircle,
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 bg-muted/50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Book your cricket ground in 4 simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <step.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="bg-primary text-white text-sm font-medium rounded-full w-6 h-6 flex items-center justify-center mb-4">
                {step.id}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 max-w-3xl mx-auto bg-white dark:bg-background border rounded-lg p-8">
          <h3 className="text-2xl font-semibold mb-4 text-center">Need Help?</h3>
          <p className="text-muted-foreground text-center mb-6">
            Our team is available to help you with any questions you may have about booking cricket grounds.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Email:</span>
              <a href="mailto:help@stumpsnslots.com" className="text-primary hover:underline">help@stumpsnslots.com</a>
            </div>
            <div className="hidden sm:block text-muted-foreground">|</div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Phone:</span>
              <a href="tel:+11234567890" className="text-primary hover:underline">+1 (123) 456-7890</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
