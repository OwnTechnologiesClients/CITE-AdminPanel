import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Consistent date formatting to avoid hydration mismatches
export function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${day}/${month}/${year}`;
}

/**
 * Get full image URL from backend path
 * @param {string} imagePath - Path from backend (e.g., /uploads/task-photo-proofs/file.jpg)
 * @returns {string} Full URL to access the image
 */
export function getImageUrl(imagePath) {
  if (!imagePath) return null;
  
  // If already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Get API base URL (defaults to http://localhost:5000/api)
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
  
  // Remove /api from base URL to get server root
  const serverRoot = API_BASE_URL.replace('/api', '');
  
  // Ensure path starts with /
  const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  return `${serverRoot}${path}`;
}