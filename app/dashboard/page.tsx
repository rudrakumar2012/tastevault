'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import RecipeCard from '../../components/RecipeCard';
import { updateRecipeNote, unsaveRecipe } from '../../actions/recipe-actions';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userSavedRecipes, setUserSavedRecipes] = useState<any[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [editingNote, setEditingNote] = useState<{ mealId: string; note: string } | null>(null);
  const [savingNote, setSavingNote] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin?callbackUrl=/dashboard');
      return;
    }
    fetchSavedRecipes();
  }, [session, status]);

  const fetchSavedRecipes = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/saved-recipes');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setUserSavedRecipes(data);
    } catch (error) {
      console.error('Error fetching saved recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (mealId: string) => {
    if (!confirm('Remove this recipe from your vault?')) return;
    try {
      await unsaveRecipe(mealId);
      setUserSavedRecipes(prev => prev.filter(r => r.mealId !== mealId));
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
  };

  const handleEditNote = (mealId: string, currentNote: string) => {
    setEditingNote({ mealId, note: currentNote || '' });
  };

  const handleSaveNote = async () => {
    if (!editingNote) return;
    setSavingNote(true);
    try {
      await updateRecipeNote(editingNote.mealId, editingNote.note);
      setUserSavedRecipes(prev =>
        prev.map(r =>
          r.mealId === editingNote.mealId
            ? { ...r, note: editingNote.note.trim() || null }
            : r
        )
      );
      setEditingNote(null);
    } catch (error: any) {
      alert('Error saving note: ' + error.message);
    } finally {
      setSavingNote(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
  };

  const handleClearNote = async (mealId: string) => {
    if (!confirm('Clear this note?')) return;
    try {
      await updateRecipeNote(mealId, '');
      setUserSavedRecipes(prev =>
        prev.map(r =>
          r.mealId === mealId
            ? { ...r, note: null }
            : r
        )
      );
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
  };

  // Get unique categories for filter
  const categories = ['all', ...new Set(userSavedRecipes.map(r => r.category).filter(Boolean))];

  // Filter recipes
  const filteredRecipes = filterCategory === 'all'
    ? userSavedRecipes
    : userSavedRecipes.filter(r => r.category === filterCategory);

  if (status === 'loading' || loading) {
    return (
      <main style={{ padding: '40px', fontFamily: 'system-ui', color: '#E4E4E7', minHeight: '100vh' }}>
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main style={{ padding: '40px', fontFamily: 'system-ui', color: '#E4E4E7', minHeight: '100vh' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ color: '#69F6B8', margin: '0 0 10px 0', fontSize: '2.5rem' }}>
          My Vault
        </h1>
        <p style={{ color: '#A1A1AA', margin: 0 }}>
          Welcome back, {session?.user?.name || session?.user?.email}!
        </p>
        <p style={{ color: '#A1A1AA', margin: '10px 0 0 0' }}>
          {userSavedRecipes.length > 0
            ? `You have ${userSavedRecipes.length} saved recipe${userSavedRecipes.length === 1 ? '' : 's'}`
            : 'You haven\'t saved any recipes yet.'}
        </p>

        {filteredRecipes.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <label style={{ color: '#E4E4E7', marginRight: '10px' }}>Filter by category:</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #333',
                backgroundColor: '#0B0E14',
                color: '#E4E4E7',
                outline: 'none'
              }}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {filteredRecipes.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {filteredRecipes.map((savedRecipe) => (
            <div key={savedRecipe.mealId} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <RecipeCard
                recipe={{
                  idMeal: savedRecipe.mealId,
                  strMeal: savedRecipe.title,
                  strMealThumb: savedRecipe.image || '',
                  strCategory: savedRecipe.category || '',
                  strArea: '',
                }}
                isSaved={true}
                onUnsave={() => handleUnsave(savedRecipe.mealId)}
              />

              {/* Note editor */}
              <div style={{
                backgroundColor: '#18181B',
                padding: '15px',
                borderRadius: '8px',
                border: '1px solid #333'
              }}>
                {editingNote?.mealId === savedRecipe.mealId ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <textarea
                      value={editingNote.note}
                      onChange={(e) => setEditingNote({ ...editingNote, note: e.target.value })}
                      placeholder="Add a note..."
                      style={{
                        width: '100%',
                        minHeight: '80px',
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #333',
                        backgroundColor: '#0B0E14',
                        color: '#E4E4E7',
                        resize: 'vertical',
                        boxSizing: 'border-box',
                        fontFamily: 'inherit'
                      }}
                    />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={handleSaveNote}
                        disabled={savingNote}
                        style={{
                          flex: 1,
                          padding: '6px 12px',
                          borderRadius: '4px',
                          backgroundColor: '#69F6B8',
                          color: '#0B0E14',
                          border: 'none',
                          fontWeight: 'bold',
                          cursor: savingNote ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {savingNote ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={savingNote}
                        style={{
                          flex: 1,
                          padding: '6px 12px',
                          borderRadius: '4px',
                          backgroundColor: '#3f3f46',
                          color: '#E4E4E7',
                          border: 'none',
                          cursor: savingNote ? 'not-allowed' : 'pointer'
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    {savedRecipe.note && (
                      <p style={{
                        margin: '0 0 10px 0',
                        fontSize: '14px',
                        color: '#A1A1AA',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word'
                      }}>
                        {savedRecipe.note}
                      </p>
                    )}
                    <button
                      onClick={() => handleEditNote(savedRecipe.mealId, savedRecipe.note || '')}
                      style={{
                        width: '100%',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        backgroundColor: '#3f3f46',
                        color: '#E4E4E7',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      {savedRecipe.note ? 'Edit Note' : 'Add Note'}
                    </button>
                    {savedRecipe.note && (
                      <button
                        onClick={() => handleClearNote(savedRecipe.mealId)}
                        style={{
                          width: '100%',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          backgroundColor: 'transparent',
                          color: '#ef4444',
                          border: '1px solid #ef4444',
                          cursor: 'pointer',
                          fontSize: '12px',
                          marginTop: '5px'
                        }}
                      >
                        Clear Note
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#18181B', borderRadius: '12px' }}>
          <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
            {filterCategory !== 'all'
              ? `No ${filterCategory} recipes in your vault.`
              : 'Start exploring and save recipes to your vault!'}
          </p>
          <a
            href="/"
            style={{ color: '#69F6B8', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem' }}
          >
            Go to Discovery →
          </a>
        </div>
      )}
    </main>
  );
}
