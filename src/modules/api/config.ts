/**
 * API Configuration
 * Configure your server URL here
 */

// API Base URL - configured via environment variable
// Development: http://localhost:3001
// Local Network: http://192.168.1.100:3001
// Internet: http://www.mark-tietz.duckdns.org:3001
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://www.mark-tietz.duckdns.org:3001';

// Helper to build API URLs
export function apiUrl(path: string): string {
  return `${API_BASE_URL}/api${path}`;
}

