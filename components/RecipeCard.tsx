'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { saveApiRecipe, unsaveRecipe } from '../actions/recipe-actions';

interface RecipeCardProps {
  recipe: {
    idMeal: string;
    strMeal: string;
    strMealThumb: string;
    strCategory: string;
    strArea?: string;
  };
  isSaved?: boolean;
  onUnsave?: () => void;
  onSave?: () => void;
}

export default function RecipeCard({
  recipe,
  isSaved: initialIsSaved = false,
  onUnsave,
  onSave,
}: RecipeCardProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [isSaving, setIsSaving] = useState(false);
  const [isUnsaving, setIsUnsaving] = useState(false);

  const handleSaveClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    if (isSaved) {
      handleUnsave(e);
    } else {
      setIsSaving(true);
      try {
        await saveApiRecipe(
          recipe.strMeal,
          recipe.strCategory,
          recipe.idMeal,
          recipe.strMealThumb,
          undefined // no note required on save; can add later in My Kitchen
        );
        setIsSaved(true);
        onSave?.();
      } catch (error) {
        console.error('Failed to save recipe:', error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleUnsave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsUnsaving(true);
    try {
      if (onUnsave) {
        await onUnsave();
      } else {
        await unsaveRecipe(recipe.idMeal);
      }
      setIsSaved(false);
    } catch (error) {
      console.error('Failed to unsave recipe:', error);
    } finally {
      setIsUnsaving(false);
    }
  };


  const isAuthenticated = !!session;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ y: -4 }}
      className="group relative flex flex-col rounded-2xl overflow-hidden bg-surface border border-border shadow-sm hover:shadow-xl transition-all duration-300"
    >
      {/* Image */}
      <Link
        href={`/recipe/${recipe.idMeal}`}
        className="relative aspect-[4/3] overflow-hidden"
      >
        <motion.img
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 text-xs font-medium bg-background/80 backdrop-blur-sm text-foreground rounded-full border border-border">
            {recipe.strCategory}
          </span>
        </div>


        {/* Quick Action Save Button */}
        <div className="absolute bottom-3 right-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSaveClick}
            disabled={isSaving || isUnsaving}
            className={`
              flex items-center justify-center w-12 h-12 rounded-full shadow-lg backdrop-blur-sm border transition-all duration-300
              ${isSaved
                ? 'bg-red-500/90 border-red-500/50 text-white hover:bg-red-600'
                : isAuthenticated
                  ? 'bg-accent/90 border-accent/50 text-background hover:bg-accent'
                  : 'bg-muted/50 border-muted/30 text-muted cursor-not-allowed'
              }
              ${(isSaving || isUnsaving) ? 'opacity-60 pointer-events-none' : ''}
            `}
            aria-label={isSaved ? 'Unsave recipe' : 'Save recipe'}
          >
            <AnimatePresence mode="wait">
              {isUnsaving ? (
                <motion.div
                  key="unsaving"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
                />
              ) : isSaving ? (
                <motion.div
                  key="saving"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
                />
              ) : isSaved ? (
                <motion.svg
                  key="saved"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </motion.svg>
              ) : (
                <motion.svg
                  key="unsaved"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </motion.svg>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        <div className="flex-1">
          <Link href={`/recipe/${recipe.idMeal}`}>
            <h3 className="text-lg font-semibold text-foreground leading-snug group-hover:text-accent transition-colors duration-200 mb-2 line-clamp-2">
              {recipe.strMeal}
            </h3>
          </Link>
          <div className="flex items-center gap-2 text-xs text-muted">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              </svg>
              {recipe.strArea || 'Global'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
