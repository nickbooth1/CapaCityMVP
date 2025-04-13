'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/layout/Navigation";
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        console.log(`Auth event: ${event}, refreshing router...`);
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  return (
    <html lang="en">
      <head>
        <title>CapaCity - Airport Capacity Planning</title>
        <meta name="description" content="Airport capacity planning and scheduling tool" />
      </head>
      <body className={`${inter.className} bg-airport-gray`}>
        <div className="flex">
          <Navigation />
          <main className="ml-64 flex-1 p-8 min-h-screen">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
