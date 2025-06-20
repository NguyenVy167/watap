import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export function formatRating(rating: number): string {
  return (rating / 10).toFixed(1);
}

export function calculateReadingTime(wordCount: number): string {
  const wordsPerMinute = 200;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

export function getGenreColor(genre: string): string {
  const colors: Record<string, string> = {
    'Fantasy': 'bg-purple-100 text-purple-800',
    'Romance': 'bg-pink-100 text-pink-800',
    'Mystery': 'bg-gray-100 text-gray-800',
    'Science Fiction': 'bg-blue-100 text-blue-800',
    'Adventure': 'bg-green-100 text-green-800',
    'Horror': 'bg-red-100 text-red-800',
    'Teen Fiction': 'bg-yellow-100 text-yellow-800',
  };
  
  return colors[genre] || 'bg-gray-100 text-gray-800';
}
