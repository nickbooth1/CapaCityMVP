import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
// import { createClient } from '@supabase/supabase-js'; // Commented out original

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Use createClientComponentClient for client-side Supabase access in Next.js App Router
export const supabase = createClientComponentClient({ supabaseUrl, supabaseKey: supabaseAnonKey });

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          created_at: string;
          role: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          created_at?: string;
          role?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          created_at?: string;
          role?: string;
        };
      };
      airports: {
        Row: {
          id: string;
          name: string;
          iata_code: string | null;
          icao_code: string | null;
          created_at: string;
          location: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          iata_code?: string | null;
          icao_code?: string | null;
          created_at?: string;
          location?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          iata_code?: string | null;
          icao_code?: string | null;
          created_at?: string;
          location?: string | null;
        };
      };
      stands: {
        Row: {
          id: string;
          name: string;
          airport_id: string;
          created_at: string;
          status: 'active' | 'maintenance' | 'inactive';
        };
        Insert: {
          id?: string;
          name: string;
          airport_id: string;
          created_at?: string;
          status?: 'active' | 'maintenance' | 'inactive';
        };
        Update: {
          id?: string;
          name?: string;
          airport_id?: string;
          created_at?: string;
          status?: 'active' | 'maintenance' | 'inactive';
        };
      };
      maintenance_requests: {
        Row: {
          id: string;
          stand_id: string;
          description: string;
          start_date: string;
          end_date: string;
          status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
          created_at: string;
          created_by: string;
        };
        Insert: {
          id?: string;
          stand_id: string;
          description: string;
          start_date: string;
          end_date: string;
          status?: 'planned' | 'in_progress' | 'completed' | 'cancelled';
          created_at?: string;
          created_by: string;
        };
        Update: {
          id?: string;
          stand_id?: string;
          description?: string;
          start_date?: string;
          end_date?: string;
          status?: 'planned' | 'in_progress' | 'completed' | 'cancelled';
          created_at?: string;
          created_by?: string;
        };
      };
    };
  };
}; 