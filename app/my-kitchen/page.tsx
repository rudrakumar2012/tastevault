'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import RecipeCard from '../../components/RecipeCard';
import { updateRecipeNote, unsaveRecipe } from '../../actions/recipe-actions';

export default function MyKitchenPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userSavedRecipes, setUserSavedRecipes] = useState<any[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [savingNote, setSavingNote] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin?callbackUrl=/my-kitchen');
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
    try {
      await unsaveRecipe(mealId);
      setUserSavedRecipes(prev => prev.filter(r => r.mealId !== mealId));
    } catch (error: any) {
      console.error('Error unsaving recipe:', error);
    }
  };

  const handleSaveNote = async (mealId: string, note: string) => {
    setSavingNote(mealId);
    try {
      await updateRecipeNote(mealId, note.trim() || undefined);
      setUserSavedRecipes(prev =>
        prev.map(r =>
          r.mealId === mealId
            ? { ...r, note: note.trim() || null }
            : r
        )
      );
    } catch (error: any) {
      console.error('Error saving note:', error);
    } finally {
      setSavingNote(null);
    }
  };

  const handleClearNote = async (mealId: string) => {
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
      console.error('Error clearing note:', error);
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
      <div className="min-h-screen bg-background pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border-3 border-accent border-t-transparent rounded-full animate-spin" />
              <span className="text-muted text-lg">Loading your kitchen...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground tracking-tight mb-3">
                My Kitchen
              </h1>
              <p className="text-lg text-muted">
                Welcome back{!session?.user?.name ? '' : `, ${session.user.name.split(' ')[0]}`}! Here are your saved recipes.
              </p>
            </div>
            {userSavedRecipes.length > 0 && (
              <div className="flex items-center gap-3 text-muted">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <span className="text-lg font-medium">
                  {userSavedRecipes.length} recipe{userSavedRecipes.length === 1 ? '' : 'es'}
                </span>
              </div>
            )}
          </div>

          {/* Category Filter */}
          {filteredRecipes.length > 0 && (
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-muted">Filter by category:</span>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                      filterCategory === cat
                        ? 'bg-accent text-background'
                        : 'bg-surface text-muted hover:text-foreground border border-border hover:border-accent/50'
                    }`}
                  >
                    {cat === 'all' ? 'All Categories' : cat}
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Recipe Grid */}
        {filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {filteredRecipes.map((savedRecipe, index) => (
              <motion.div
                key={savedRecipe.mealId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="flex flex-col gap-4"
              >
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

                {/* Note Editor */}
                <div className="bg-surface border border-border rounded-xl p-4 transition-all duration-200 hover:border-accent/30">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-muted flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Your Note
                    </span>
                    {savedRecipe.note && (
                      <button
                        onClick={() => handleClearNote(savedRecipe.mealId)}
                        className="text-xs text-red-400 hover:text-red-300 transition-colors"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <textarea
                    defaultValue={savedRecipe.note || ''}
                    onBlur={(e) => handleSaveNote(savedRecipe.mealId, e.target.value)}
                    placeholder="Add your cooking notes, tweaks, or tips..."
                    className="w-full h-24 px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder-muted/50 focus:outline-none focus:border-accent resize-none"
                    disabled={savingNote === savedRecipe.mealId}
                  />
                  {savingNote === savedRecipe.mealId && (
                    <p className="text-xs text-accent mt-2 flex items-center gap-2">
                      <div className="w-3 h-3 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                      Saving...
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 px-6 bg-surface border border-border rounded-2xl"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-background border border-border mb-6">
              <svg className="w-10 h-10 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-3">
              {filterCategory !== 'all'
                ? `No ${filterCategory} recipes in your kitchen`
                : 'Your kitchen is empty'}
            </h3>
            <p className="text-muted mb-8 max-w-md mx-auto">
              {filterCategory !== 'all'
                ? `Try selecting "All Categories" or add some ${filterCategory} recipes from the discovery page.`
                : 'Start exploring recipes and save your favorites to build your personal collection.'}
            </p>
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href="/discover"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-accent text-background font-semibold rounded-full hover:bg-accent-hover transition-all duration-200 shadow-lg shadow-accent/20 hover:shadow-accent/30"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Explore Recipes
            </motion.a>
          </motion.div>
        )}
      </div>
    </div>
  );
}
