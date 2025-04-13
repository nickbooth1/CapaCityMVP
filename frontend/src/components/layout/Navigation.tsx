'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  HomeIcon, 
  WrenchIcon, 
  Cog6ToothIcon, 
  BuildingOfficeIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { supabase } from '@/lib/supabase';

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  
  const navItems = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Stands', href: '/stands', icon: BuildingOfficeIcon },
    { name: 'Maintenance', href: '/maintenance', icon: WrenchIcon },
    { name: 'Configuration', href: '/config', icon: Cog6ToothIcon },
  ];

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      console.log('Logged out successfully');
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="bg-airport-black text-airport-white h-screen w-64 fixed left-0 top-0 p-4">
      <div className="flex items-center justify-center mb-8 pt-4">
        <h1 className="text-2xl font-airport font-bold">
          <span className="text-airport-yellow">Capa</span>City
        </h1>
      </div>
      
      <ul className="space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center p-3 rounded-md transition-colors ${
                  isActive 
                    ? 'bg-airport-yellow text-airport-black' 
                    : 'hover:bg-airport-gray'
                }`}
              >
                <Icon className="h-6 w-6 mr-3" />
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
      
      <div className="absolute bottom-8 left-0 w-full px-4">
        <button
          onClick={handleLogout}
          className="flex items-center p-3 rounded-md transition-colors hover:bg-airport-gray w-full"
        >
          <ArrowRightOnRectangleIcon className="h-6 w-6 mr-3" />
          Logout
        </button>
      </div>
    </nav>
  );
} 