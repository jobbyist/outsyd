import React from 'react';
import { Check, Gift, Percent, Crown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const benefits = [
  {
    icon: Percent,
    title: 'Cashback & Discounts',
    description: 'Get exclusive cashback on ticket purchases for participating events'
  },
  {
    icon: Gift,
    title: 'Monthly Giveaways',
    description: 'Exclusive access to our monthly premium member giveaways'
  },
  {
    icon: Crown,
    title: 'Members Only Perks',
    description: 'Early access to ticket sales, VIP upgrades, and exclusive experiences'
  },
  {
    icon: Sparkles,
    title: 'Priority Support',
    description: 'Skip the queue with dedicated premium member support'
  }
];

export const PremiumSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 md:py-24 px-4 md:px-8 bg-foreground text-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-background/20 mb-6">
            <Crown className="w-4 h-4" />
            <span className="text-sm font-medium uppercase tracking-wider">Premium Membership</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium mb-4">
            OUTSYD Premium
          </h2>
          <p className="text-lg text-background/70 max-w-2xl mx-auto mb-8">
            Unlock exclusive benefits and never miss out on the best events across Africa
          </p>
          <div className="flex items-baseline justify-center gap-1 mb-8">
            <span className="text-5xl md:text-6xl font-bold">$4.99</span>
            <span className="text-xl text-background/70">/month</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="p-6 border border-background/20 rounded-lg hover:border-background/40 transition-colors"
            >
              <benefit.icon className="w-8 h-8 mb-4" />
              <h3 className="font-medium mb-2">{benefit.title}</h3>
              <p className="text-sm text-background/70">{benefit.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button 
            size="lg"
            className="bg-background text-foreground hover:bg-background/90 px-8 py-6 text-lg"
            onClick={() => navigate('/premium')}
          >
            <Crown className="w-5 h-5 mr-2" />
            Get Premium Access
          </Button>
          <p className="text-sm text-background/50 mt-4">
            Cancel anytime. No commitment required.
          </p>
        </div>
      </div>
    </section>
  );
};
