import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SEOHead } from '@/components/SEOHead';

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Terms of Service"
        description="Read the Terms of Service for OUTSYD, the leading events discovery platform across Africa."
      />
      <Navbar />
      
      <main className="pt-32 pb-16 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-medium mb-8">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: December 2024</p>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-medium mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground mb-4">
                By accessing and using OUTSYD ("the Platform"), you accept and agree to be bound by the terms 
                and provision of this agreement. If you do not agree to abide by the above, please do not use 
                this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-medium mb-4">2. Use of Service</h2>
              <p className="text-muted-foreground mb-4">
                OUTSYD provides a platform for discovering, creating, and managing events across Africa. 
                You agree to use this service only for lawful purposes and in accordance with these Terms.
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>You must be at least 18 years old to use this service</li>
                <li>You are responsible for maintaining the confidentiality of your account</li>
                <li>You agree not to upload false or misleading event information</li>
                <li>You agree not to use the platform for any fraudulent activities</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-medium mb-4">3. Event Listings</h2>
              <p className="text-muted-foreground mb-4">
                Event organizers are responsible for the accuracy of their event listings. OUTSYD does not 
                guarantee the accuracy, completeness, or quality of any event listings and is not responsible 
                for any events that are cancelled, postponed, or do not meet expectations.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-medium mb-4">4. Ticket Sales</h2>
              <p className="text-muted-foreground mb-4">
                Ticket sales are facilitated through our platform. All sales are final unless otherwise 
                specified by the event organizer. Refund policies are set by individual event organizers.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-medium mb-4">5. Intellectual Property</h2>
              <p className="text-muted-foreground mb-4">
                All content on this platform, including but not limited to text, graphics, logos, and software, 
                is the property of OUTSYD or its content suppliers and is protected by international copyright laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-medium mb-4">6. Limitation of Liability</h2>
              <p className="text-muted-foreground mb-4">
                OUTSYD shall not be liable for any indirect, incidental, special, consequential, or punitive 
                damages resulting from your use of or inability to use the service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-medium mb-4">7. Contact</h2>
              <p className="text-muted-foreground">
                For questions about these Terms, please contact us at legal@outsyd.africa
              </p>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Terms;