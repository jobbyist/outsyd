import React from 'react';

interface AdPlaceholderProps {
  size: 'banner' | 'square' | 'leaderboard';
  className?: string;
}

const sizeClasses = {
  banner: 'w-full h-24 md:h-32',
  square: 'w-full aspect-square max-w-[300px]',
  leaderboard: 'w-full h-20 md:h-24',
};

export const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ size, className = '' }) => {
  return (
    <div 
      className={`bg-muted border border-border flex items-center justify-center ${sizeClasses[size]} ${className}`}
    >
      <div className="text-center">
        <span className="text-muted-foreground text-xs uppercase tracking-wider">Sponsored</span>
        <p className="text-muted-foreground/60 text-[10px] mt-1">Advertisement</p>
      </div>
    </div>
  );
};