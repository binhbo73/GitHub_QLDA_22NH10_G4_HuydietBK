'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { handleLogout } from '@/lib/login';

export function Navbar() {
  const pathname = usePathname();
  const userId = localStorage.getItem('userId') || null;

  const handleLogoutClick = () => {
    handleLogout();
    window.location.href = '/';
  };

  return (
    <header className='w-full py-4 px-6 flex items-center justify-between border-b border-purple-900'>
      <div className='flex items-center gap-2'>
        <Link href='/' className='flex items-center gap-2'>
          <div className='relative w-10 h-10'>
            <Image
              src='/anime-style-earth.jpg?height=60&width=60'
              alt='AI Content Logo'
              width={40}
              height={40}
              className='rounded-full bg-purple-600'
            />
          </div>
          <span className='font-bold text-lg tracking-wider'>AI CONTENT</span>
        </Link>
      </div>

      <nav className='hidden md:flex items-center gap-8'>
        {userId ? (
          <>
            <Link
              href='/chatbot/general'
              className={`text-sm font-medium transition-colors ${
                pathname === '/chatbot/general'
                  ? 'text-purple-400'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              General Content
            </Link>
            <Link
              href='/chatbot/sales'
              className={`text-sm font-medium transition-colors ${
                pathname === '/chatbot/sales'
                  ? 'text-purple-400'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Sale Content
            </Link>
            <Link
              href='/chatbot/negotiation'
              className={`text-sm font-medium transition-colors ${
                pathname === '/chatbot/negotiation'
                  ? 'text-purple-400'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Docs Content
            </Link>
            <Link
              href='/chatbot/marketing'
              className={`text-sm font-medium transition-colors ${
                pathname === '/chatbot/marketing'
                  ? 'text-purple-400'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Marketing Content
            </Link>
          </>
        ) : (
          <>
            <Link
              href='/'
              className={`text-sm font-medium transition-colors ${
                pathname === '/'
                  ? 'text-purple-400'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Home
            </Link>
            <Link
              href='/about'
              className={`text-sm font-medium transition-colors ${
                pathname === '/about'
                  ? 'text-purple-400'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              About
            </Link>
            <Link
              href='/services'
              className={`text-sm font-medium transition-colors ${
                pathname === '/services'
                  ? 'text-purple-400'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Services
            </Link>
          </>
        )}
      </nav>

      <div className='flex items-center gap-4'>
        {userId ? (
          <Button
            onClick={handleLogoutClick}
            variant='outline'
            className='rounded-full border-purple-600 text-white hover:bg-purple-900'
          >
            Log Out
          </Button>
        ) : (
          <>
            <Link href='/login'>
              <Button
                variant='outline'
                className='rounded-full border-purple-600 text-white hover:bg-purple-900'
              >
                Log In
              </Button>
            </Link>
            <Link href='/signup'>
              <Button className='rounded-full bg-purple-600 text-white hover:bg-purple-700'>
                Sign Up
              </Button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
