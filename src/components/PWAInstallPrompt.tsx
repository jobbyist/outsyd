import React, { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const isDismissed = localStorage.getItem('pwa-prompt-dismissed');
    if (isDismissed) {
      setDismissed(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  if (!showPrompt || dismissed) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-6 md:w-[360px] z-40 bg-background border border-foreground rounded-lg shadow-2xl p-4 animate-fade-in">
      <button onClick={handleDismiss} className="absolute top-2 right-2 p-1 hover:bg-muted rounded">
        <X className="w-4 h-4" />
      </button>
      <div className="flex items-start gap-4">
        <img src="/app-icon.png" alt="OUTSYD" className="w-12 h-12 rounded-lg" />
        <div className="flex-1">
          <h3 className="font-medium mb-1">Install OUTSYD</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Add to your home screen for quick access and notifications
          </p>
          <Button size="sm" onClick={handleInstall} className="gradient-brand">
            <Download className="w-4 h-4 mr-2" />
            Install App
          </Button>
        </div>
      </div>
    </div>
  );
};
