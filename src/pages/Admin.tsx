
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BookingManagement from '@/components/admin/BookingManagement';
import GroundManagement from '@/components/admin/GroundManagement';

const Admin = () => {
  const { user, userRole, loading } = useAuth('admin');

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div>Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20">
        <div className="container max-w-7xl mx-auto p-6">
          <div className="bg-white dark:bg-background rounded-lg shadow-md border p-6">
            <div className="flex items-center gap-3 mb-8">
              <Shield className="h-8 w-8 text-amber-600" />
              <h1 className="text-3xl font-extrabold">Admin Dashboard</h1>
              <div className="ml-auto px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                Administrator Access
              </div>
            </div>

            <Tabs defaultValue="bookings" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="bookings">Booking Management</TabsTrigger>
                <TabsTrigger value="grounds">Ground Management</TabsTrigger>
              </TabsList>

              <TabsContent value="bookings" className="space-y-6">
                <BookingManagement />
              </TabsContent>

              <TabsContent value="grounds" className="space-y-6">
                <GroundManagement />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
