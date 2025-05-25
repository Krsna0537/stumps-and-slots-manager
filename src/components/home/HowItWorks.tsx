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
      </div>
    </section>
  );
};

export default HowItWorks;
