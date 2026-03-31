'use client'

import { useState } from 'react';
import Link from 'next/link';
import { saveApiRecipe } from '../actions/recipe-actions';

export default function RecipeCard({ recipe }: { recipe: any }) {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevents the Link from triggering when you click the save button
    setIsSaving(true);
    await saveApiRecipe(recipe.strMeal, recipe.strCategory);
    setIsSaving(false);
    setIsSaved(true);
  };

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
        <button 
          onClick={handleSave}
          disabled={isSaved || isSaving}
          style={{ 
            padding: '8px 16px', backgroundColor: isSaved ? '#3f3f46' : '#69F6B8', 
            color: isSaved ? '#A1A1AA' : '#0B0E14', border: 'none', borderRadius: '6px',
            fontWeight: 'bold', cursor: isSaved ? 'default' : 'pointer', width: '100%', transition: 'all 0.2s'
          }}
        >
          {isSaving ? 'Saving...' : isSaved ? '✓ Saved' : 'Save to Vault'}
        </button>
      </div>
    </div>
  );
}