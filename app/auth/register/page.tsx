'use client';

import { useState } from 'react';
import { registerUser } from '../../../actions/auth-actions';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      await registerUser(name, email, password);
      router.push('/auth/signin?registered=true');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
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
          Create Account
        </h1>
        <p style={{ color: '#A1A1AA', marginBottom: '30px', textAlign: 'center' }}>
          Join TasteVault and start saving recipes
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

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ color: '#E4E4E7', marginBottom: '5px', display: 'block' }}>
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              placeholder="John Doe"
            />
          </div>

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
              minLength={6}
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

          <div>
            <label style={{ color: '#E4E4E7', marginBottom: '5px', display: 'block' }}>
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <p style={{ color: '#A1A1AA', fontSize: '14px' }}>
            Already have an account?{' '}
            <Link href="/auth/signin" style={{ color: '#69F6B8', textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
