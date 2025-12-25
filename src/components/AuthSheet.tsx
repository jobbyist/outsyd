import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, User, Calendar, ArrowRight, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

interface AuthSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const signUpSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address').max(255, 'Email is too long'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(72, 'Password is too long'),
  fullName: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  phone: z.string().optional(),
});

const signInSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type UserIntent = 'browse' | 'create' | null;

export const AuthSheet: React.FC<AuthSheetProps> = ({ isOpen, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [step, setStep] = useState<'intent' | 'form'>('intent');
  const [userIntent, setUserIntent] = useState<UserIntent>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setPhone('');
    setStep('intent');
    setUserIntent(null);
  };

  const handleIntentSelect = (intent: UserIntent) => {
    setUserIntent(intent);
    setStep('form');
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        // Validate signup form
        const validation = signUpSchema.safeParse({ email, password, fullName, phone });
        if (!validation.success) {
          toast({
            title: 'Validation Error',
            description: validation.error.errors[0].message,
            variant: 'destructive'
          });
          setLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: fullName,
              user_intent: userIntent,
            }
          }
        });
        
        if (error) throw error;

        // Create profile with additional data
        if (data.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              user_id: data.user.id,
              display_name: fullName,
              full_name: fullName,
              phone: phone || null,
              user_intent: userIntent,
            });
          
          if (profileError) {
            console.error('Profile creation error:', profileError);
          }
        }
        
        toast({
          title: 'Account created!',
          description: 'Welcome to OUTSYD! You can now explore events.'
        });
        resetForm();
        onClose();
      } else {
        // Validate signin form
        const validation = signInSchema.safeParse({ email, password });
        if (!validation.success) {
          toast({
            title: 'Validation Error',
            description: validation.error.errors[0].message,
            variant: 'destructive'
          });
          setLoading(false);
          return;
        }

        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) throw error;
        
        toast({
          title: 'Welcome back!',
          description: 'You have successfully signed in.'
        });
        resetForm();
        onClose();
      }
    } catch (error: any) {
      let message = error.message;
      if (message.includes('User already registered')) {
        message = 'An account with this email already exists. Please sign in instead.';
      } else if (message.includes('Invalid login credentials')) {
        message = 'Invalid email or password. Please try again.';
      }
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black opacity-50 z-[1000]"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-[#1A1A1A] z-[1001] shadow-2xl transition-transform duration-300 ${isOpen ? 'animate-slide-in-right' : ''}`}>
        {/* Close button */}
        <button
          onClick={() => { resetForm(); onClose(); }}
          className="absolute top-8 right-8 text-white hover:text-gray-300 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Content */}
        <div className="flex flex-col h-full px-10 pt-24 pb-10 overflow-y-auto">
          {/* Sign In Mode */}
          {!isSignUp && (
            <>
              <h2 className="text-white text-4xl font-medium mb-2">Sign In</h2>
              <p className="text-gray-400 text-sm mb-8">
                Welcome back! Please sign in to continue
              </p>

              <form onSubmit={handleAuth} className="flex flex-col gap-6">
                <div>
                  <label htmlFor="email" className="block text-white text-sm font-medium mb-2 uppercase tracking-wide">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-white/10 border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-white text-sm font-medium mb-2 uppercase tracking-wide">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-white/10 border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full gradient-brand text-foreground font-medium py-3 px-6 uppercase text-sm border border-black hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Please wait...' : 'Sign In'}
                </button>
              </form>
            </>
          )}

          {/* Sign Up Mode - Intent Selection */}
          {isSignUp && step === 'intent' && (
            <>
              <h2 className="text-white text-4xl font-medium mb-2">Join OUTSYD</h2>
              <p className="text-gray-400 text-sm mb-8">
                What brings you here?
              </p>

              <div className="flex flex-col gap-4">
                <button
                  onClick={() => handleIntentSelect('browse')}
                  className="group relative w-full p-6 border border-white/20 hover:border-primary transition-colors text-left"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full gradient-brand flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white text-lg font-medium mb-1">Browse Events</h3>
                      <p className="text-gray-400 text-sm">Discover and attend amazing events across Africa</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors mt-1" />
                  </div>
                </button>

                <button
                  onClick={() => handleIntentSelect('create')}
                  className="group relative w-full p-6 border border-white/20 hover:border-primary transition-colors text-left"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full gradient-brand flex items-center justify-center">
                      <User className="w-6 h-6 text-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white text-lg font-medium mb-1">Create Events</h3>
                      <p className="text-gray-400 text-sm">Host and manage your own events, sell tickets</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors mt-1" />
                  </div>
                </button>
              </div>
            </>
          )}

          {/* Sign Up Mode - Form */}
          {isSignUp && step === 'form' && (
            <>
              <button
                onClick={() => setStep('intent')}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back</span>
              </button>

              <h2 className="text-white text-4xl font-medium mb-2">Create Account</h2>
              <p className="text-gray-400 text-sm mb-8">
                {userIntent === 'browse' 
                  ? 'Get ready to discover amazing events' 
                  : 'Start hosting your events today'}
              </p>

              <form onSubmit={handleAuth} className="flex flex-col gap-5">
                <div>
                  <label htmlFor="fullName" className="block text-white text-sm font-medium mb-2 uppercase tracking-wide">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full bg-white/10 border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="signupEmail" className="block text-white text-sm font-medium mb-2 uppercase tracking-wide">
                    Email
                  </label>
                  <input
                    id="signupEmail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-white/10 border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-white text-sm font-medium mb-2 uppercase tracking-wide">
                    Phone (Optional)
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                    placeholder="+1 234 567 8900"
                  />
                </div>

                <div>
                  <label htmlFor="signupPassword" className="block text-white text-sm font-medium mb-2 uppercase tracking-wide">
                    Password
                  </label>
                  <input
                    id="signupPassword"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full bg-white/10 border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                    placeholder="••••••••"
                  />
                  <p className="text-gray-500 text-xs mt-1">Minimum 8 characters</p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full gradient-brand text-foreground font-medium py-3 px-6 uppercase text-sm border border-black hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
            </>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => { setIsSignUp(!isSignUp); setStep('intent'); }}
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              {isSignUp 
                ? 'Already have an account? Sign in' 
                : "Don't have an account? Create one"}
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};