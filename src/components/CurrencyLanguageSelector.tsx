import React from 'react';
import { Globe, DollarSign } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCurrencyStore } from '@/stores/currencyStore';
import { useLanguageStore } from '@/stores/languageStore';

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
  { code: 'GHS', symbol: 'GH₵', name: 'Ghanaian Cedi' },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
  { code: 'BWP', symbol: 'P', name: 'Botswana Pula' },
  { code: 'TZS', symbol: 'TSh', name: 'Tanzanian Shilling' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
];

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'sw', name: 'Kiswahili', flag: '🇰🇪' },
  { code: 'zu', name: 'isiZulu', flag: '🇿🇦' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ar', name: 'العربية', flag: '🇪🇬' },
];

export const CurrencyLanguageSelector = () => {
  const { currency, setCurrency } = useCurrencyStore();
  const { language, setLanguage } = useLanguageStore();

  return (
    <div className="flex items-center gap-2">
      {/* Currency Selector */}
      <Select value={currency} onValueChange={setCurrency}>
        <SelectTrigger className="w-[100px] h-8 text-xs border-foreground">
          <DollarSign className="w-3 h-3 mr-1" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {currencies.map((curr) => (
            <SelectItem key={curr.code} value={curr.code} className="text-xs">
              <span className="font-medium">{curr.code}</span>
              <span className="text-muted-foreground ml-1">({curr.symbol})</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Language Selector */}
      <Select value={language} onValueChange={setLanguage}>
        <SelectTrigger className="w-[110px] h-8 text-xs border-foreground">
          <Globe className="w-3 h-3 mr-1" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code} className="text-xs">
              <span className="mr-1">{lang.flag}</span>
              {lang.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export const convertCurrency = (amountUSD: number, targetCurrency: string): { amount: number; symbol: string } => {
  // Exchange rates (approximate - in production, use a live API)
  const rates: Record<string, { rate: number; symbol: string }> = {
    USD: { rate: 1, symbol: '$' },
    ZAR: { rate: 18.5, symbol: 'R' },
    NGN: { rate: 1550, symbol: '₦' },
    GHS: { rate: 14.5, symbol: 'GH₵' },
    KES: { rate: 153, symbol: 'KSh' },
    BWP: { rate: 13.5, symbol: 'P' },
    TZS: { rate: 2500, symbol: 'TSh' },
    EUR: { rate: 0.92, symbol: '€' },
    GBP: { rate: 0.79, symbol: '£' },
  };

  const target = rates[targetCurrency] || rates.USD;
  return {
    amount: Math.round(amountUSD * target.rate * 100) / 100,
    symbol: target.symbol
  };
};

export const formatPrice = (amountUSD: number, currency: string): string => {
  const { amount, symbol } = convertCurrency(amountUSD, currency);
  return `${symbol}${amount.toLocaleString()}`;
};
