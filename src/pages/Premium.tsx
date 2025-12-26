import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SEOHead } from '@/components/SEOHead';
import { AdPlaceholder } from '@/components/AdPlaceholder';
import { Button } from '@/components/ui/button';
import { Check, Crown, Gift, Percent, Sparkles, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const benefits = [
  'Cashback on ticket purchases (participating events)',
  'Exclusive access to monthly giveaways',
  'Early access to ticket sales',
  'VIP upgrade opportunities',
  'Members-only experiences and events',
  'Priority customer support',
  'Partner discounts at restaurants & venues',
  'Ad-free browsing experience'
];

const Premium = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.info('Please sign in to subscribe to Premium');
        navigate('/auth');
        return;
      }

      // For now, redirect to contact - in production, integrate with payment provider
      toast.success('Thank you for your interest! Premium subscriptions coming soon.');
      navigate('/contact');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Premium Membership - Exclusive Benefits & Rewards"
        description="Join OUTSYD Premium for $4.99/month. Get cashback on tickets, exclusive giveaways, early access to sales, VIP upgrades, and members-only perks across Africa's best events in South Africa, Nigeria, Kenya, Ghana and beyond."
        keywords="OUTSYD Premium, event membership, cashback tickets, exclusive giveaways, VIP events Africa, event rewards, premium membership, early ticket access, event perks South Africa, event benefits Nigeria"
      />
      <Navbar />
      
      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="px-4 md:px-8 py-16 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-foreground mb-6">
              <Crown className="w-4 h-4" />
              <span className="text-sm font-medium uppercase tracking-wider">Premium Membership</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium mb-6">
              Experience Events Like Never Before
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of members enjoying exclusive benefits, cashback rewards, and unforgettable experiences across Africa.
            </p>

            <div className="flex items-baseline justify-center gap-1 mb-8">
              <span className="text-5xl md:text-6xl font-bold">$4.99</span>
              <span className="text-xl text-muted-foreground">/month</span>
            </div>

            <Button 
              size="lg"
              className="gradient-brand px-8 py-6 text-lg"
              onClick={handleSubscribe}
              disabled={loading}
            >
              <Crown className="w-5 h-5 mr-2" />
              {loading ? 'Processing...' : 'Start Premium Membership'}
            </Button>

            <p className="text-sm text-muted-foreground mt-4">
              Cancel anytime. 7-day free trial for new members.
            </p>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="px-4 md:px-8 py-16 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-medium text-center mb-12">
              Premium Benefits
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-4 bg-background border border-foreground/10 rounded-lg"
                >
                  <div className="w-6 h-6 rounded-full gradient-brand flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="px-4 md:px-8 py-16">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-brand flex items-center justify-center">
                <Percent className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-medium mb-2">Cashback Rewards</h3>
              <p className="text-muted-foreground">
                Earn cashback on every ticket purchase at participating events
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-brand flex items-center justify-center">
                <Gift className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-medium mb-2">Monthly Giveaways</h3>
              <p className="text-muted-foreground">
                Win VIP tickets, merchandise, and exclusive experiences every month
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-brand flex items-center justify-center">
                <Star className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-medium mb-2">VIP Treatment</h3>
              <p className="text-muted-foreground">
                Priority access, upgrades, and members-only event experiences
              </p>
            </div>
          </div>
        </section>

        {/* Sponsored Ad */}
        <section className="px-4 md:px-8 pb-8">
          <div className="max-w-5xl mx-auto">
            <AdPlaceholder size="leaderboard" />
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 md:px-8 py-16">
          <div className="max-w-2xl mx-auto text-center bg-foreground text-background p-8 md:p-12 rounded-lg">
            <Crown className="w-12 h-12 mx-auto mb-6" />
            <h2 className="text-2xl md:text-3xl font-medium mb-4">
              Ready to Go Premium?
            </h2>
            <p className="text-background/70 mb-8">
              Join now and start enjoying exclusive benefits today.
            </p>
            <Button 
              size="lg"
              className="bg-background text-foreground hover:bg-background/90 px-8"
              onClick={handleSubscribe}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Subscribe Now - $4.99/month'}
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Premium;
