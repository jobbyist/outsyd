export const EVENT_CATEGORIES = [
  { value: 'music', label: 'Music', emoji: '🎵' },
  { value: 'sports', label: 'Sports', emoji: '⚽' },
  { value: 'tech', label: 'Tech', emoji: '💻' },
  { value: 'arts', label: 'Arts & Culture', emoji: '🎨' },
  { value: 'food', label: 'Food & Drink', emoji: '🍽️' },
  { value: 'fashion', label: 'Fashion', emoji: '👗' },
  { value: 'business', label: 'Business', emoji: '💼' },
  { value: 'comedy', label: 'Comedy', emoji: '😂' },
  { value: 'nightlife', label: 'Nightlife', emoji: '🌙' },
  { value: 'wellness', label: 'Wellness', emoji: '🧘' },
  { value: 'community', label: 'Community', emoji: '🤝' },
  { value: 'other', label: 'Other', emoji: '✨' },
] as const;

export type EventCategory = typeof EVENT_CATEGORIES[number]['value'];
