import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SEOHead } from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Check, Users, DollarSign, Share2, TrendingUp, Gift, Megaphone } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const benefits = [
  {
    icon: DollarSign,
    title: '20% Recurring Commission',
    description: 'Earn 20% on every Premium subscription from your referrals - for as long as they stay subscribed'
  },
  {
    icon: TrendingUp,
    title: 'Passive Income',
    description: 'Build a sustainable income stream as your audience grows'
  },
  {
    icon: Gift,
    title: 'Exclusive Perks',
    description: 'Get free Premium access, event tickets, and early feature access'
  },
  {
    icon: Megaphone,
    title: 'Marketing Support',
    description: 'Access branded content, graphics, and promotional materials'
  }
];

const Affiliate = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    socialMedia: '',
    audience: '',
    motivation: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In production, this would create an affiliate application
      // For now, we'll just show a success message
      toast.success('Application submitted! We\'ll review your application and get back to you within 48 hours.');
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        socialMedia: '',
        audience: '',
        motivation: ''
      });
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Become an Affiliate"
        description="Join OUTSYD's Brand Ambassador program. Earn 20% recurring commission promoting Africa's premier event platform to your audience."
        keywords="affiliate program, brand ambassador, earn money, OUTSYD affiliate, event promotion Africa"
      />
      <Navbar />
      
      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="px-4 md:px-8 py-16 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-foreground mb-6">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium uppercase tracking-wider">Ambassador Program</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium mb-6">
              Become an OUTSYD Affiliate
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8">
              Share the love for African events and earn 20% recurring commission on every Premium subscription you refer.
            </p>

            <div className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-full mb-8">
              <span className="text-2xl font-bold">20%</span>
              <span>ongoing commission</span>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="px-4 md:px-8 py-16 bg-muted/30">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-medium text-center mb-12">
              Why Partner With Us?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex gap-4 p-6 bg-background border border-foreground/10 rounded-lg">
                  <div className="w-12 h-12 rounded-full gradient-brand flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="px-4 md:px-8 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-medium text-center mb-12">
              How It Works
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-xl">
                  1
                </div>
                <h3 className="font-medium mb-2">Apply</h3>
                <p className="text-sm text-muted-foreground">
                  Fill out our simple application form below
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-xl">
                  2
                </div>
                <h3 className="font-medium mb-2">Share</h3>
                <p className="text-sm text-muted-foreground">
                  Get your unique referral link and share with your audience
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-xl">
                  3
                </div>
                <h3 className="font-medium mb-2">Earn</h3>
                <p className="text-sm text-muted-foreground">
                  Receive 20% of every Premium subscription, paid monthly
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Application Form */}
        <section className="px-4 md:px-8 py-16 bg-muted/30">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-medium text-center mb-4">
              Apply Now
            </h2>
            <p className="text-center text-muted-foreground mb-8">
              We review all applications within 48 hours
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="socialMedia">Primary Social Media *</Label>
                  <Input
                    id="socialMedia"
                    placeholder="e.g., @yourhandle on Instagram"
                    value={formData.socialMedia}
                    onChange={(e) => setFormData({ ...formData, socialMedia: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="audience">Tell us about your audience *</Label>
                <Textarea
                  id="audience"
                  placeholder="Who follows you? What's your niche? Approximate audience size?"
                  value={formData.audience}
                  onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                  rows={3}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="motivation">Why do you want to partner with OUTSYD?</Label>
                <Textarea
                  id="motivation"
                  placeholder="Tell us about your experience with events and why you're excited about OUTSYD"
                  value={formData.motivation}
                  onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                  rows={3}
                />
              </div>
              
              <Button 
                type="submit" 
                size="lg" 
                className="w-full gradient-brand"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </Button>
              
              <p className="text-xs text-center text-muted-foreground">
                By applying, you agree to our affiliate terms and conditions. We'll contact you via email within 48 hours.
              </p>
            </form>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-4 md:px-8 py-16">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-medium text-center mb-8">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">How much can I earn?</h3>
                <p className="text-muted-foreground text-sm">
                  You earn 20% of every Premium subscription ($4.99/month) for as long as your referral stays subscribed. That's about $1 per month per subscriber - it adds up!
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">When do I get paid?</h3>
                <p className="text-muted-foreground text-sm">
                  Commissions are paid monthly via bank transfer or mobile money. Minimum payout is $20.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Who can apply?</h3>
                <p className="text-muted-foreground text-sm">
                  Anyone with an engaged audience interested in events, entertainment, travel, or African culture. Content creators, influencers, bloggers, and community leaders are perfect fits.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Do I need a minimum audience size?</h3>
                <p className="text-muted-foreground text-sm">
                  No minimum requirement! We value engagement over follower count. If your audience trusts your recommendations, we want to work with you.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Affiliate;
