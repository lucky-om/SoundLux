import { createBrowserClient } from '@supabase/ssr';

// Fallback values so the app doesn't crash before Supabase is configured.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xyzcompanyabc.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5emNvbXBhbnlhYmMiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYwMDAwMDAwMCwiZXhwIjoxOTAwMDAwMDAwfQ.placeholder';

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// Global client instance for backward compatibility in client components
export const supabase = createClient();
