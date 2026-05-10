import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

/**
 * Optimizes Unsplash images by adding size and quality parameters.
 */
export function getOptimizedImageUrl(url: string, width: number = 800, quality: number = 80) {
  if (!url || !url.includes('unsplash.com')) return url;
  
  try {
    const urlObj = new URL(url);
    // Standardize params for better caching and performance
    urlObj.searchParams.set('auto', 'format');
    urlObj.searchParams.set('fit', 'crop');
    urlObj.searchParams.set('w', width.toString());
    urlObj.searchParams.set('q', quality.toString());
    
    return urlObj.toString();
  } catch (e) {
    // If URL parsing fails, attempt simple string manipulation
    const baseUrl = url.split('?')[0];
    return `${baseUrl}?auto=format&fit=crop&w=${width}&q=${quality}`;
  }
}
