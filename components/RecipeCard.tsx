'use client'

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { saveApiRecipe, unsaveRecipe } from '../actions/recipe-actions';

export default function RecipeCard({ recipe, isSaved: initialIsSaved = false, onUnsave }: { recipe: any; isSaved?: boolean; onUnsave?: () => void }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isUnsaving, setIsUnsaving] = useState(false);
  const [isSaved, setIsSaved] = useState(initialIsSaved);

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    setIsSaving(true);
    await saveApiRecipe(recipe.strMeal, recipe.strCategory, recipe.idMeal, recipe.strMealThumb);
    setIsSaving(false);
    setIsSaved(true);
  };

  const handleUnsave = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsUnsaving(true);
    if (onUnsave) {
      await onUnsave();
    } else {
      await unsaveRecipe(recipe.idMeal);
    }
    setIsUnsaving(false);
    setIsSaved(false);
  };

  const isAuthenticated = !!session;
  const showSaveButton = isAuthenticated && !isSaved;

  return (
    <div style={{ border: '1px solid #333', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#18181B', display: 'flex', flexDirection: 'column' }}>
      <Link href={`/recipe/${recipe.idMeal}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
        <img
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
          style={{ width: '100%', height: '200px', objectFit: 'cover' }}
        />
        <div style={{ padding: '15px 15px 0 15px' }}>
          <h3 style={{ margin: '0 0 10px 0' }}>{recipe.strMeal}</h3>
          <p style={{ fontSize: '12px', color: '#A1A1AA', margin: 0 }}>
            Category: {recipe.strCategory} | Origin: {recipe.strArea}
          </p>
        </div>
      </Link>

      <div style={{ padding: '15px', marginTop: 'auto' }}>
        {isAuthenticated ? (
          isSaved ? (
            <button
              onClick={handleUnsave}
              disabled={isUnsaving}
              style={{
                padding: '8px 16px',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: isUnsaving ? 'not-allowed' : 'pointer',
                width: '100%',
                transition: 'all 0.2s'
              }}
            >
              {isUnsaving ? 'Removing...' : 'Unsave'}
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={isSaving}
              style={{
                padding: '8px 16px',
                backgroundColor: '#69F6B8',
                color: '#0B0E14',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: isSaving ? 'not-allowed' : 'pointer',
                width: '100%',
                transition: 'all 0.2s'
              }}
            >
              {isSaving ? 'Saving...' : 'Save to Vault'}
            </button>
          )
        ) : (
          <button
            onClick={handleSave}
            disabled
            style={{
              padding: '8px 16px',
              backgroundColor: '#3f3f46',
              color: '#A1A1AA',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'not-allowed',
              width: '100%'
            }}
          >
            Sign in to save
          </button>
        )}
      </div>
    </div>
  );
}