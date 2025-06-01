'use client';

import { useGoogleLogin } from '@react-oauth/google';
import { Button } from '@/components/ui/button';
import { handleLoginWithGoogle } from '@/lib/login';
import Notification from '@/components/notification';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function GoogleLoginButton() {
  const router = useRouter();
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const login = useGoogleLogin({
    onSuccess: async credentialResponse => {
      console.log('Google login successful:', credentialResponse);
      try {
        const loginData = await handleLoginWithGoogle(credentialResponse);
        if (loginData.user?.id) {
          console.log('User ID:', loginData.user.id);
          setLoginSuccess(true);
          setToastMessage('Google login successful!');
          setTimeout(() => {
            router.push('/chatbot/general');
          }, 2000);
        }
      } catch (error: any) {
        setLoginError(true);
        setToastMessage(error.message + '.' || 'Login failed');
      }
    },
    onError: () => {
      console.error('Login Failed');
    },
    flow: 'implicit'
  });

  return (
    <>
      <Button
        variant='outline'
        className='py-5 border-purple-700 hover:bg-purple-900/50 rounded-full'
        onClick={() => login()}
      >
        <svg className='mr-2 h-4 w-4' viewBox='0 0 24 24'>
          <path
            fill='currentColor'
            d='M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z'
          />
        </svg>
        Google
      </Button>

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
    </>
  );
}
