'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/' });
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0B0E14',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#18181B',
        padding: '40px',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
      }}>
        <h1 style={{ color: '#69F6B8', marginBottom: '10px', textAlign: 'center' }}>
          Sign In
        </h1>
        <p style={{ color: '#A1A1AA', marginBottom: '30px', textAlign: 'center' }}>
          Access your TasteVault
        </p>

        {error && (
          <div style={{
            backgroundColor: '#ef4444',
            color: 'white',
            padding: '10px',
            borderRadius: '6px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleCredentialsSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ color: '#E4E4E7', marginBottom: '5px', display: 'block' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #333',
                backgroundColor: '#0B0E14',
                color: '#FFF',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label style={{ color: '#E4E4E7', marginBottom: '5px', display: 'block' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #333',
                backgroundColor: '#0B0E14',
                color: '#FFF',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              padding: '12px',
              borderRadius: '6px',
              backgroundColor: '#69F6B8',
              color: '#0B0E14',
              border: 'none',
              fontWeight: 'bold',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1,
              marginTop: '10px'
            }}
          >
            {isLoading ? 'Signing in...' : 'Sign in with Email'}
          </button>
        </form>

        <div style={{ margin: '20px 0', textAlign: 'center' }}>
          <span style={{ color: '#A1A1AA' }}>or</span>
        </div>

        <button
          onClick={handleGoogleSignIn}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '6px',
            backgroundColor: '#fff',
            color: '#0B0E14',
            border: 'none',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        </button>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <p style={{ color: '#A1A1AA', fontSize: '14px' }}>
            Don't have an account?{' '}
            <Link href="/auth/register" style={{ color: '#69F6B8', textDecoration: 'none' }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
