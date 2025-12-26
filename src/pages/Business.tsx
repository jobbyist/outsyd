import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SEOHead } from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Check, Globe, Ticket, BarChart3, Palette, Brain, Users, Zap, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const freeFeatures = [
  'List events for free (up to 30 days)',
  'Basic event page',
  'Social sharing tools',
  'Event analytics overview',
  'Email support'
];

const paidFeatures = [
  'Customized event website with your branding',
  'Free custom domain included',
  'Custom email address included',
  'Multi-currency ticketing support',
  'Built-in marketing tools for social media',
  'Weekly user analytics reports',
  'Free graphic design services',
  'AI-powered suggestions to improve performance',
  'Dedicated account manager'
];

const plans = [
  {
    name: 'Single Event',
    price: '$99',
    period: 'one-time',
    description: 'Perfect for one-off events',
    features: ['1 event listing', 'All paid features included', '30-day support']
  },
  {
    name: 'Starter',
    price: '$25',
    originalPrice: '$31.25',
    period: '/month',
    description: 'Up to 5 events',
    popular: false,
    discount: 'NEWBIE26 for 20% off'
  },
  {
    name: 'Professional',
    price: '$49',
    originalPrice: '$61.25',
    period: '/month',
    description: 'Up to 12 events',
    popular: true,
    discount: 'NEWBIE26 for 20% off'
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'Unlimited events',
    features: ['Custom pricing based on needs', 'White-label solution', 'API access', 'Priority support']
  }
];

const Business = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="OUTSYD for Business"
        description="Manage and promote your events with OUTSYD for Business. Get custom event websites, ticketing, analytics, marketing tools and more starting at $25/month."
        keywords="event management, event ticketing, event marketing, business events Africa, OUTSYD for Business"
      />
      <Navbar />
      
      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="px-4 md:px-8 py-16 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-foreground mb-6">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium uppercase tracking-wider">For Event Organizers</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium mb-6">
              OUTSYD for Business
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8">
              Everything you need to create, manage, and promote successful events across Africa. Start free, upgrade when you're ready.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="gradient-brand px-8"
                onClick={() => navigate('/create-event')}
              >
                List Your Event Free
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate('/contact')}
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </section>

        {/* Free vs Paid */}
        <section className="px-4 md:px-8 py-16 bg-muted/30">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-medium text-center mb-12">
              Start Free, Scale as You Grow
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Free Tier */}
              <div className="p-8 bg-background border border-foreground/10 rounded-lg">
                <h3 className="text-xl font-medium mb-2">Free Package</h3>
                <p className="text-muted-foreground mb-6">Get started at no cost</p>
                <ul className="space-y-3">
                  {freeFeatures.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 mt-0.5 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Paid Features */}
              <div className="p-8 bg-foreground text-background rounded-lg">
                <h3 className="text-xl font-medium mb-2">Paid Packages</h3>
                <p className="text-background/70 mb-6">Unlock all features</p>
                <ul className="space-y-3">
                  {paidFeatures.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Plans */}
        <section className="px-4 md:px-8 py-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-medium text-center mb-4">
              Choose Your Plan
            </h2>
            <p className="text-center text-muted-foreground mb-12">
              First-time users get <span className="font-bold text-foreground">20% off</span> with code <span className="font-mono bg-muted px-2 py-1 rounded">NEWBIE26</span>
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {plans.map((plan, index) => (
                <div 
                  key={index}
                  className={`p-6 border rounded-lg relative ${
                    plan.popular 
                      ? 'border-foreground bg-foreground text-background' 
                      : 'border-foreground/20'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-background text-foreground text-xs font-medium uppercase rounded-full">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-lg font-medium mb-1">{plan.name}</h3>
                  <p className={`text-sm mb-4 ${plan.popular ? 'text-background/70' : 'text-muted-foreground'}`}>
                    {plan.description}
                  </p>
                  <div className="mb-6">
                    {plan.originalPrice && (
                      <span className={`text-sm line-through ${plan.popular ? 'text-background/50' : 'text-muted-foreground'}`}>
                        {plan.originalPrice}
                      </span>
                    )}
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      <span className={plan.popular ? 'text-background/70' : 'text-muted-foreground'}>
                        {plan.period}
                      </span>
                    </div>
                  </div>
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-background text-foreground hover:bg-background/90' 
                        : ''
                    }`}
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => navigate('/contact')}
                  >
                    {plan.name === 'Enterprise' ? 'Contact Us' : 'Get Started'}
                  </Button>
                  {plan.discount && (
                    <p className={`text-xs mt-3 text-center ${plan.popular ? 'text-background/70' : 'text-muted-foreground'}`}>
                      Use {plan.discount}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="px-4 md:px-8 py-16 bg-muted/30">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-medium text-center mb-12">
              Everything You Need to Succeed
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <Globe className="w-10 h-10 mx-auto mb-4" />
                <h3 className="font-medium mb-2">Custom Event Website</h3>
                <p className="text-sm text-muted-foreground">
                  Your brand, your domain, your event. Fully customizable event pages.
                </p>
              </div>
              
              <div className="text-center p-6">
                <Ticket className="w-10 h-10 mx-auto mb-4" />
                <h3 className="font-medium mb-2">Multi-Currency Ticketing</h3>
                <p className="text-sm text-muted-foreground">
                  Sell tickets in any currency. Accept payments from anywhere.
                </p>
              </div>
              
              <div className="text-center p-6">
                <BarChart3 className="w-10 h-10 mx-auto mb-4" />
                <h3 className="font-medium mb-2">Analytics & Insights</h3>
                <p className="text-sm text-muted-foreground">
                  Weekly reports with actionable insights to grow your events.
                </p>
              </div>
              
              <div className="text-center p-6">
                <Palette className="w-10 h-10 mx-auto mb-4" />
                <h3 className="font-medium mb-2">Design Services</h3>
                <p className="text-sm text-muted-foreground">
                  Free graphic design for promotional materials and social media.
                </p>
              </div>
              
              <div className="text-center p-6">
                <Brain className="w-10 h-10 mx-auto mb-4" />
                <h3 className="font-medium mb-2">AI Recommendations</h3>
                <p className="text-sm text-muted-foreground">
                  Smart suggestions to optimize pricing, timing, and marketing.
                </p>
              </div>
              
              <div className="text-center p-6">
                <Users className="w-10 h-10 mx-auto mb-4" />
                <h3 className="font-medium mb-2">Dedicated Support</h3>
                <p className="text-sm text-muted-foreground">
                  Personal account manager to help you succeed.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 md:px-8 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-medium mb-4">
              Ready to Transform Your Events?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join hundreds of event organizers already using OUTSYD for Business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="gradient-brand px-8"
                onClick={() => navigate('/create-event')}
              >
                Start Free Today
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate('/contact')}
              >
                <Mail className="w-4 h-4 mr-2" />
                Talk to Sales
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Business;
