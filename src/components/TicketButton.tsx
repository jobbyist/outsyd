import React from 'react';
import { ExternalLink, Ticket, ShoppingCart } from 'lucide-react';
import { useCartStore, TicketCartItem } from '@/stores/cartStore';
import { toast } from 'sonner';

interface TicketButtonProps {
  ticketUrl?: string | null;
  ticketPrice?: number | null;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventImage: string;
  shopifyVariantId?: string | null;
  className?: string;
}

export const TicketButton: React.FC<TicketButtonProps> = ({ 
  ticketUrl, 
  ticketPrice, 
  eventId,
  eventTitle,
  eventDate,
  eventImage,
  shopifyVariantId,
  className 
}) => {
  const addItem = useCartStore(state => state.addItem);

  // If we have a Shopify variant, use cart checkout
  if (shopifyVariantId) {
    const handleAddToCart = () => {
      const cartItem: TicketCartItem = {
        eventId,
        eventTitle,
        eventDate,
        eventImage,
        variantId: shopifyVariantId,
        price: {
          amount: ticketPrice?.toString() || '0',
          currencyCode: 'ZAR',
        },
        quantity: 1,
      };
      
      addItem(cartItem);
      toast.success('Ticket added to cart!', {
        position: 'top-center',
      });
    };

    const priceDisplay = ticketPrice 
      ? `Add to Cart - R${ticketPrice.toFixed(2)}`
      : 'Add to Cart';

    return (
      <button
        onClick={handleAddToCart}
        className={`group flex items-center justify-center gap-2 px-6 py-3 gradient-brand text-foreground border border-foreground font-medium text-sm uppercase tracking-wider hover:opacity-90 transition-opacity ${className}`}
      >
        <ShoppingCart className="w-4 h-4" />
        <span>{priceDisplay}</span>
      </button>
    );
  }

  // External ticket link fallback
  if (!ticketUrl) return null;

  const priceDisplay = ticketPrice 
    ? `Get Tickets - R${ticketPrice.toFixed(2)}`
    : 'Get Tickets';

  return (
    <a
      href={ticketUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex items-center justify-center gap-2 px-6 py-3 gradient-brand text-foreground border border-foreground font-medium text-sm uppercase tracking-wider hover:opacity-90 transition-opacity ${className}`}
    >
      <Ticket className="w-4 h-4" />
      <span>{priceDisplay}</span>
      <ExternalLink className="w-3 h-3 opacity-60" />
    </a>
  );
};