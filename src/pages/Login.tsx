import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Eye, EyeOff, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only check session if we're not already on the login page
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: userProfile, error: profileError } = await supabase
          .from('user_profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();
        
        if (profileError) {
          if (profileError.code === 'PGRST116') {
            toast({
              title: "Profile Not Found",
              description: "No profile found for this user. Please contact support or register again.",
              variant: "destructive",
            });
            await supabase.auth.signOut();
            return;
          }
          return;
        }

        const isAdmin = userProfile?.is_admin;
        const userRole = isAdmin === true ? 'admin' : 'user';

        // Get the intended destination from location state or default to appropriate dashboard
        const from = location.state?.from || (userRole === 'admin' ? '/admin' : '/dashboard');
        
        // Only redirect if we're not already on the login page
        if (location.pathname === '/login') {
          navigate(from, { replace: true });
        }
      }
    };
    checkUser();
  }, [navigate, location, toast]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (data.user) {
        const { data: userProfile, error: profileError } = await supabase
          .from('user_profiles')
          .select('is_admin')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          if (profileError.code === 'PGRST116') {
            toast({
              title: "Profile Not Found",
              description: "No profile found for this user. Please contact support or register again.",
              variant: "destructive",
            });
            await supabase.auth.signOut();
            setLoading(false);
            return;
          }
          setLoading(false);
          return;
        }

        const isAdmin = userProfile?.is_admin;

        // Check if trying to login as admin but user is not admin
        if (isAdminLogin && isAdmin !== true) {
          await supabase.auth.signOut();
          toast({
            title: "Access Denied",
            description: "You don't have admin privileges. Please use regular login.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        // Check if trying regular login but user is admin
        if (!isAdminLogin && isAdmin === true) {
          toast({
            title: "Admin Account Detected",
            description: "Please use admin login for admin accounts.",
            variant: "destructive",
          });
          setIsAdminLogin(true);
          await supabase.auth.signOut();
          setLoading(false);
          return;
        }

        const userRole = isAdmin === true ? 'admin' : 'user';
        const from = location.state?.from || (userRole === 'admin' ? '/admin' : '/dashboard');

        toast({
          title: "Login Successful",
          description: `Welcome back${userRole === 'admin' ? ', Admin' : ''}!`,
        });

        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error('Unexpected login error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Calendar className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold">StumpsNSlots</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">
            {isAdminLogin ? 'Admin login to manage the platform' : 'Sign in to book your cricket ground'}
          </p>
        </div>

        <Card className="border shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
              {isAdminLogin && <Shield className="h-6 w-6 text-amber-600" />}
              {isAdminLogin ? 'Admin Login' : 'User Login'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Admin Login Toggle */}
            <div className="flex items-center space-x-2 mb-6 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Checkbox
                id="admin-login"
                checked={isAdminLogin}
                onCheckedChange={(checked) => {
                  setIsAdminLogin(!!checked);
                  setEmail('');
                  setPassword('');
                }}
              />
              <Label htmlFor="admin-login" className="flex items-center gap-2 cursor-pointer">
                <Shield className="h-4 w-4 text-amber-600" />
                Admin Login
              </Label>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  {isAdminLogin ? 'Admin Email' : 'Email'}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={isAdminLogin ? "Enter admin email" : "Enter your email"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                className={`w-full h-11 ${isAdminLogin ? 'bg-amber-600 hover:bg-amber-700' : ''}`}
                disabled={loading}
              >
                {loading ? 'Signing In...' : isAdminLogin ? 'Sign In as Admin' : 'Sign In'}
              </Button>
            </form>

            {!isAdminLogin && (
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-green-600 hover:underline font-medium">
                    Sign up here
                  </Link>
                </p>
              </div>
            )}

            <div className="mt-4 text-center">
              <Link to="/" className="text-sm text-muted-foreground hover:underline">
                ← Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>

        {isAdminLogin && (
          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p className="text-sm text-amber-800 dark:text-amber-200 text-center">
              <Shield className="h-4 w-4 inline mr-1" />
              Admin access is restricted to authorized personnel only.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
