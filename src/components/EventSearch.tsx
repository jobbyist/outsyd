import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface EventSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export const EventSearch = ({ value, onChange }: EventSearchProps) => {
  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search events by name or description..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 pr-10 py-2 border-foreground focus-visible:ring-foreground"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
