import React, { useState } from 'react';
import { AFRICAN_COUNTRIES, getCitiesByCountry } from '@/constants/africanLocations';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface LocationFilterProps {
  selectedCountry: string | null;
  selectedCity: string | null;
  onCountryChange: (country: string | null) => void;
  onCityChange: (city: string | null) => void;
}

export const LocationFilter: React.FC<LocationFilterProps> = ({
  selectedCountry,
  selectedCity,
  onCountryChange,
  onCityChange,
}) => {
  const [countryOpen, setCountryOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);

  const cities = selectedCountry ? getCitiesByCountry(selectedCountry) : [];

  const handleCountrySelect = (country: string | null) => {
    onCountryChange(country);
    onCityChange(null);
    setCountryOpen(false);
  };

  const handleCitySelect = (city: string | null) => {
    onCityChange(city);
    setCityOpen(false);
  };

  return (
    <div className="flex gap-2">
      {/* Country Filter */}
      <Popover open={countryOpen} onOpenChange={setCountryOpen}>
        <PopoverTrigger asChild>
          <button
            className={cn(
              "px-3 py-1.5 text-[11px] font-medium uppercase border transition-colors flex items-center gap-1.5",
              selectedCountry
                ? "bg-foreground text-background border-foreground"
                : "bg-background text-foreground border-border hover:border-foreground"
            )}
          >
            <span>{selectedCountry || 'Country'}</span>
            <ChevronDown className="w-3 h-3" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-0 max-h-64 overflow-y-auto" align="start">
          <button
            onClick={() => handleCountrySelect(null)}
            className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors"
          >
            All Countries
          </button>
          {AFRICAN_COUNTRIES.map((country) => (
            <button
              key={country.code}
              onClick={() => handleCountrySelect(country.name)}
              className={cn(
                "w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors",
                selectedCountry === country.name && "bg-muted font-medium"
              )}
            >
              {country.name}
            </button>
          ))}
        </PopoverContent>
      </Popover>

      {/* City Filter */}
      <Popover open={cityOpen} onOpenChange={setCityOpen}>
        <PopoverTrigger asChild>
          <button
            disabled={!selectedCountry}
            className={cn(
              "px-3 py-1.5 text-[11px] font-medium uppercase border transition-colors flex items-center gap-1.5",
              selectedCity
                ? "bg-foreground text-background border-foreground"
                : "bg-background text-foreground border-border hover:border-foreground",
              !selectedCountry && "opacity-50 cursor-not-allowed"
            )}
          >
            <span>{selectedCity || 'City'}</span>
            <ChevronDown className="w-3 h-3" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-0 max-h-64 overflow-y-auto" align="start">
          <button
            onClick={() => handleCitySelect(null)}
            className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors"
          >
            All Cities
          </button>
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => handleCitySelect(city)}
              className={cn(
                "w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors",
                selectedCity === city && "bg-muted font-medium"
              )}
            >
              {city}
            </button>
          ))}
        </PopoverContent>
      </Popover>
    </div>
  );
};
