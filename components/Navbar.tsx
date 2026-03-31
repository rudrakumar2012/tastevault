'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

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
    </nav>
  );
}