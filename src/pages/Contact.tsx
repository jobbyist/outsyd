import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SEOHead } from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Mail, MapPin, Phone } from 'lucide-react';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: z.string().trim().email('Please enter a valid email address').max(255, 'Email is too long'),
  subject: z.string().trim().min(5, 'Subject must be at least 5 characters').max(200, 'Subject is too long'),
  message: z.string().trim().min(20, 'Message must be at least 20 characters').max(2000, 'Message is too long'),
});

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = contactSchema.safeParse(formData);
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Message sent!', {
      description: 'We\'ll get back to you as soon as possible.',
    });
    
    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Contact Us"
        description="Get in touch with the OUTSYD team. We're here to help with any questions about events across Africa."
      />
      <Navbar />
      
      <main className="pt-32 pb-16 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-medium mb-4">Contact Us</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Have questions about OUTSYD? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="flex flex-col items-center text-center p-6 border border-border">
              <div className="w-12 h-12 gradient-brand flex items-center justify-center mb-4">
                <Mail className="w-5 h-5 text-foreground" />
              </div>
              <h3 className="font-medium mb-2">Email</h3>
              <a href="mailto:hello@outsyd.africa" className="text-muted-foreground hover:text-foreground transition-colors">
                hello@outsyd.africa
              </a>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 border border-border">
              <div className="w-12 h-12 gradient-brand flex items-center justify-center mb-4">
                <MapPin className="w-5 h-5 text-foreground" />
              </div>
              <h3 className="font-medium mb-2">Location</h3>
              <p className="text-muted-foreground">
                Cape Town, South Africa
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 border border-border">
              <div className="w-12 h-12 gradient-brand flex items-center justify-center mb-4">
                <Phone className="w-5 h-5 text-foreground" />
              </div>
              <h3 className="font-medium mb-2">Phone</h3>
              <p className="text-muted-foreground">
                +27 21 123 4567
              </p>
            </div>
          </div>
          
          <div className="max-w-xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2 uppercase tracking-wide">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full border border-border bg-background px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2 uppercase tracking-wide">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full border border-border bg-background px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2 uppercase tracking-wide">
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  className="w-full border border-border bg-background px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                  placeholder="What's this about?"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2 uppercase tracking-wide">
                  Message
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={6}
                  className="w-full border border-border bg-background px-4 py-3 focus:outline-none focus:border-primary transition-colors resize-none"
                  placeholder="Tell us more..."
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full gradient-brand text-foreground hover:opacity-90 py-6"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;