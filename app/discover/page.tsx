'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import RecipeCard from '../../components/RecipeCard';
import { unsaveRecipe } from '../../actions/recipe-actions';

const CATEGORIES = [
  'All',
  'Beef',
  'Chicken',
  'Dessert',
  'Seafood',
  'Pasta',
  'Vegan',
  'Vegetarian',
  'Breakfast',
  'Lunch',
  'Dinner',
  'Appetizer',
  'Snack',
];

const SUGGESTED_SEARCHES = [
  'Chicken Parmesan',
  'Beef Wellington',
  'Chocolate Cake',
  'Pasta Carbonara',
  'Salmon Teriyaki',
  'Vegetable Stir Fry',
];

export default function DiscoverPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [savedRecipeIds, setSavedRecipeIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const activeFilters = query || selectedCategory !== 'All';

  // Fetch user's saved recipes
  useEffect(() => {
    if (session?.user) {
      fetch('/api/saved-recipes')
        .then(res => res.json())
        .then(data => {
          const ids: Set<string> = new Set(data.map((r: any) => r.mealId));
          setSavedRecipeIds(ids);
        })
        .catch(err => {
          console.error('Failed to fetch saved recipes:', err);
        });
    } else {
      setSavedRecipeIds(new Set());
    }
  }, [session]);

  // Fetch recipes from Themealdb
  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      setError(null);

      try {
        const searchQuery = query || 'chicken';
        const res = await fetch(
          `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(searchQuery)}`
        );
        const data = await res.json();
        const fetched = data.meals || [];

        const filtered = selectedCategory === 'All'
          ? fetched
          : fetched.filter((meal: any) => meal.strCategory === selectedCategory);

        setRecipes(filtered);
      } catch (err) {
        setError('Failed to load recipes. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [query, selectedCategory]);

  const handleSearch = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedCategory !== 'All') params.set('category', selectedCategory);
    router.push(`/discover?${params.toString()}`);
  }, [selectedCategory, router]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(query);
    }
  };

  const clearFilters = () => {
    setQuery('');
    setSelectedCategory('All');
    router.push('/discover');
  };

  const handleUnsave = async (mealId: string) => {
    await unsaveRecipe(mealId);
    setSavedRecipeIds(prev => {
      const next = new Set(prev);
      next.delete(mealId);
      return next;
    });
  };

  const handleSave = (mealId: string) => {
    setSavedRecipeIds(prev => new Set(prev).add(mealId));
  };

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
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-4">
            Discover Recipes
          </h1>
          <p className="text-xl text-muted max-w-2xl">
            Explore thousands of recipes from around the world. Find your next culinary inspiration.
          </p>
        </motion.div>

        {/* Search & Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search for recipes, ingredients, cuisines..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-12 pr-4 py-4 bg-surface border border-border rounded-2xl text-foreground placeholder-muted/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all duration-200 text-lg"
              />
            </div>

            {/* Filter Toggle (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden inline-flex items-center justify-center gap-2 px-6 py-4 bg-surface border border-border rounded-2xl text-foreground hover:border-accent/50 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
              </svg>
              Filters
              {activeFilters && (
                <span className="w-2 h-2 bg-accent rounded-full" />
              )}
            </button>

            {/* Search Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSearch(query)}
              className="px-8 py-4 bg-accent text-background font-semibold rounded-2xl hover:bg-accent-hover transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-accent/10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </motion.button>
          </div>

          {/* Category Filters */}
          <AnimatePresence>
            {(showFilters || typeof window !== 'undefined' && window.innerWidth >= 1024) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden mt-6"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm font-medium text-muted">Categories:</span>
                  {CATEGORIES.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        const params = new URLSearchParams();
                        if (query) params.set('q', query);
                        if (category !== 'All') params.set('category', category);
                        router.push(`/discover?${params.toString()}`);
                      }}
                      className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                        selectedCategory === category
                          ? 'bg-accent text-background'
                          : 'bg-surface text-muted hover:text-foreground border border-border hover:border-accent/50'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                  {activeFilters && (
                    <button
                      onClick={clearFilters}
                      className="px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Suggested Searches */}
          {!query && selectedCategory === 'All' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6"
            >
              <p className="text-sm text-muted mb-3">Trending searches:</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_SEARCHES.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setQuery(suggestion)}
                    className="px-4 py-2 text-sm bg-surface border border-border rounded-full text-muted hover:text-accent hover:border-accent/30 transition-all duration-200"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Recipe Grid */}
        <div className="min-h-[60vh]">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 border-3 border-accent border-t-transparent rounded-full animate-spin" />
                <span className="text-muted text-lg">Discovering recipes...</span>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-accent hover:underline"
              >
                Try again
              </button>
            </div>
          ) : recipes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 px-6 bg-surface border border-border rounded-2xl"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-background border border-border mb-6">
                <svg className="w-10 h-10 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-3">No recipes found</h3>
              <p className="text-muted max-w-md mx-auto mb-6">
                {query || selectedCategory !== 'All'
                  ? 'Try adjusting your search or filters to find what you\'re looking for.'
                  : 'Start by searching for a recipe or browse by category.'}
              </p>
              {(query || selectedCategory !== 'All') && (
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-accent text-background font-semibold rounded-full hover:bg-accent-hover transition-all duration-200"
                >
                  Clear filters
                </button>
              )}
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {recipes.map((recipe, index) => (
                <motion.div
                  key={recipe.idMeal}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <RecipeCard
                    recipe={{
                      idMeal: recipe.idMeal,
                      strMeal: recipe.strMeal,
                      strMealThumb: recipe.strMealThumb,
                      strCategory: recipe.strCategory,
                      strArea: recipe.strArea,
                    }}
                    isSaved={savedRecipeIds.has(recipe.idMeal)}
                    onUnsave={() => handleUnsave(recipe.idMeal)}
                    onSave={() => handleSave(recipe.idMeal)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
