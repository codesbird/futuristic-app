import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URkL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASkE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

export type { User } from '@supabase/supabase-js';

const getApiUrl = (path: string) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) return path;
    return apiUrl.replace(/\/$/, "") + (path.startsWith("/") ? path : "/" + path);
};
export { getApiUrl };

// Example usage:
// const response = await fetch(getApiUrl('/api/your-endpoint'));
// const data = await response.json();

// Note: The Supabase client code is commented out. Uncomment and configure it if you plan to use Supabase in your project.