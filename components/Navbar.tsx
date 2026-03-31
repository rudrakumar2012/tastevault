'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Navbar() {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <nav style={{ padding: '20px 40px', backgroundColor: '#18181B', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
        <Link href="/" style={{ color: '#69F6B8', fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none' }}>
          TasteVault
        </Link>
        <Link href="/" style={{ color: '#E4E4E7', textDecoration: 'none', fontWeight: '500' }}>
          Discovery
        </Link>
        {session?.user && (
          <Link href="/dashboard" style={{ color: '#E4E4E7', textDecoration: 'none', fontWeight: '500' }}>
            My Vault
          </Link>
        )}
      </div>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="Search recipes (e.g., beef)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #333', backgroundColor: '#0B0E14', color: '#FFF', outline: 'none' }}
        />
        <button type="submit" style={{ padding: '8px 16px', borderRadius: '6px', backgroundColor: '#69F6B8', color: '#0B0E14', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
          Search
        </button>
      </form>

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        {status === 'loading' ? (
          <span style={{ color: '#A1A1AA', fontSize: '14px' }}>Loading...</span>
        ) : session?.user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#E4E4E7', fontSize: '14px' }}>
              {session.user.name || session.user.email}
            </span>
            {session.user.image && (
              <img
                src={session.user.image}
                alt={session.user.name || 'User'}
                style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #69F6B8' }}
              />
            )}
            <button
              onClick={() => signOut({ redirect: true, callbackUrl: '/' })}
              style={{ padding: '6px 12px', borderRadius: '6px', backgroundColor: '#3f3f46', color: '#E4E4E7', border: 'none', cursor: 'pointer', fontSize: '14px' }}
            >
              Sign out
            </button>
          </div>
        ) : (
          <Link
            href="/auth/signin"
            style={{ padding: '8px 16px', borderRadius: '6px', backgroundColor: '#69F6B8', color: '#0B0E14', textDecoration: 'none', fontWeight: 'bold' }}
          >
            Sign in
          </Link>
        )}
      </div>
    </nav>
  );
}