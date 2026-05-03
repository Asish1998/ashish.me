import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tatceopytgwllpqamicd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhdGNlb3B5dGd3bGxwcWFtaWNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMjkxMTIsImV4cCI6MjA4OTkwNTExMn0.1m0U4J7E8ritxHekEVnuTjK-B95tT40wBoRH_dp0dCk';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase Environment Variables. Analytics will not work securely.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);
