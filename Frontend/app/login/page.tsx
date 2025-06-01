'use client';

import type React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { handleLogin } from '@/lib/login';
import { GOOGLE_CLIENT_ID } from '@/lib/config';
import Notification from '@/components/notification';
import Image from 'next/image';
import GoogleLoginButton from '@/hooks/use-google';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const loginData = await handleLogin(email, password);
      if (loginData.user?.id) {
        setLoginSuccess(true);
        setToastMessage('Login successful!');
        setTimeout(() => {
          router.push('/chatbot/general');
        }, 2000);
      }
    } catch (error: any) {
      setLoginError(true);
      setToastMessage(error.message + '.' || 'Login failed');
    }
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <main className='min-h-screen flex flex-col space-bg'>
        <Link href='/' className='p-6 flex items-center gap-2'>
          <div className='relative w-10 h-10'>
            <Image
              src='/anime-style-earth.jpg?height=60&width=60'
              alt='AI Content Logo'
              width={40}
              height={40}
              className='rounded-full bg-purple-600'
            />
          </div>
          <span className='font-bold tracking-wider'>AI CONTENT</span>
        </Link>

        <div className='flex-1 flex flex-col md:flex-row'>
          <div className='flex-1 flex items-center justify-center p-8'>
            <div className='max-w-md w-full'>
              <h1 className='text-5xl font-bold mb-2'>LOGIN TO YOUR</h1>
              <h2 className='text-5xl font-bold text-purple-400 mb-12'>
                ADVENTURE!
              </h2>
            </div>
          </div>

          <div className='flex-1 flex items-center justify-center p-8'>
            <div className='max-w-md w-full'>
              <h1 className='text-5xl font-bold mb-2'>LOGIN</h1>
              <p className='text-gray-300 mb-8'>
                Login with email address and password
              </p>

              <form onSubmit={handleSubmit} className='space-y-6'>
                <div className='relative'>
                  <Mail className='absolute left-3 top-3 h-5 w-5 text-gray-400' />
                  <Input
                    type='email'
                    placeholder='yourname@gmail.com'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className='pl-10 py-6 bg-purple-900/30 border-purple-700 text-white rounded-full'
                  />
                </div>

                <div className='relative'>
                  <Lock className='absolute left-3 top-3 h-5 w-5 text-gray-400' />
                  <Input
                    type='password'
                    placeholder='Password'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className='pl-10 py-6 bg-purple-900/30 border-purple-700 text-white rounded-full'
                  />
                </div>

                <Button
                  type='submit'
                  className='w-full py-6 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 rounded-full'
                >
                  Login
                </Button>
              </form>

              <div className='mt-8'>
                <div className='relative'>
                  <div className='absolute inset-0 flex items-center'>
                    <div className='w-full border-t border-gray-700'></div>
                  </div>
                  <div className='relative flex justify-center text-sm'>
                    <span className='px-2 bg-[#13111C] text-gray-400'>
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className='mt-6 grid grid-cols-2 gap-4'>
                  <GoogleLoginButton />
                  <Button
                    variant='outline'
                    className='py-5 border-purple-700 hover:bg-purple-900/50 rounded-full'
                  >
                    <svg className='mr-2 h-4 w-4' viewBox='0 0 24 24'>
                      <path
                        fill='currentColor'
                        d='M9.101,23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085,1.848-5.978,5.858-5.978c0.401,0,0.955,0.042,1.569,0.103v3.149h-1.106c-1.269,0-1.937,0.755-1.937,2.188v2.118h3.587l-0.502,3.667h-3.085v7.98H9.101z'
                      />
                    </svg>
                    Facebook
                  </Button>
                </div>
              </div>

              <p className='mt-6 text-center text-sm text-gray-400'>
                By registering you with our{' '}
                <Link href='#' className='text-purple-400 hover:underline'>
                  Terms and Conditions
                </Link>
              </p>
            </div>
          </div>
        </div>

        {loginSuccess && (
          <Notification
            message={toastMessage}
            type='success'
            onClose={() => setLoginSuccess(false)}
            duration={4000}
          />
        )}

        {loginError && (
          <Notification
            message={toastMessage}
            type='error'
            onClose={() => setLoginError(false)}
            duration={4000}
          />
        )}
      </main>
    </GoogleOAuthProvider>
  );
}
