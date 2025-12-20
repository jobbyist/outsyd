import React from 'react';
import { ExternalLink, Ticket } from 'lucide-react';

interface TicketButtonProps {
  ticketUrl?: string | null;
  ticketPrice?: number | null;
  className?: string;
}

export const TicketButton: React.FC<TicketButtonProps> = ({ ticketUrl, ticketPrice, className }) => {
  if (!ticketUrl) return null;

  const priceDisplay = ticketPrice 
    ? `Get Tickets - $${ticketPrice.toFixed(2)}`
    : 'Get Tickets';

  return (
    <a
      href={ticketUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex items-center justify-center gap-2 px-6 py-3 bg-[#FA76FF] text-foreground border border-foreground font-medium text-sm uppercase tracking-wider hover:bg-foreground hover:text-background transition-colors ${className}`}
    >
      <Ticket className="w-4 h-4" />
      <span>{priceDisplay}</span>
      <ExternalLink className="w-3 h-3 opacity-60" />
    </a>
  );
};
