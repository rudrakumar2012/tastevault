'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { saveApiRecipe } from '../actions/recipe-actions';

interface Recipe {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strMealThumb: string;
}

interface RecipeDetailSaveButtonProps {
  recipe: Recipe;
  initialIsSaved?: boolean;
}

export default function RecipeDetailSaveButton({
  recipe,
  initialIsSaved = false
}: RecipeDetailSaveButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [isSaving, setIsSaving] = useState(false);
  const [showNoteOverlay, setShowNoteOverlay] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  const handleSaveClick = async () => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    if (isSaved) {
      // Already saved - could show unsave confirmation or do nothing
      return;
    }

    setShowNoteOverlay(true);
  };

  const handleSubmitNote = async () => {
    setIsSubmittingNote(true);
    try {
      await saveApiRecipe(
        recipe.strMeal,
        recipe.strCategory,
        recipe.idMeal,
        recipe.strMealThumb,
        noteText.trim() || undefined
      );
      setShowNoteOverlay(false);
      setNoteText('');
      setIsSaved(true);
    } catch (error) {
      console.error('Failed to save recipe:', error);
    } finally {
      setIsSubmittingNote(false);
    }
  };

  const handleCancelNote = () => {
    setShowNoteOverlay(false);
    setNoteText('');
  };

  const isAuthenticated = !!session;

  return (
    <div className="relative inline-block">
      {/* Main Save Button */}
      {!showNoteOverlay && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSaveClick}
          disabled={isSaving || !isAuthenticated}
          className={`
            inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-200 shadow-lg
            ${isSaved
              ? 'bg-red-500 text-white hover:bg-red-600 shadow-red-500/20'
              : isAuthenticated
                ? 'bg-accent text-background hover:bg-accent-hover shadow-accent/20'
                : 'bg-muted/50 text-muted cursor-not-allowed'
            }
          `}
        >
          <AnimatePresence mode="wait">
            {isSaved ? (
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
          <span>{isSaved ? 'Saved to Vault' : 'Save to Vault'}</span>
        </motion.button>
      )}

      {/* Note Overlay */}
      <AnimatePresence>
        {showNoteOverlay && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-3 z-50 w-80 sm:w-96 bg-surface border border-border rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Add a note</h3>
              <button
                onClick={handleCancelNote}
                className="text-muted hover:text-foreground transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-sm text-muted mb-4">
              Jot down any tweaks or tips for this recipe
            </p>

            <textarea
              autoFocus
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="e.g., Add extra garlic, cook 5 min longer..."
              className="w-full h-32 px-4 py-3 bg-background border border-border rounded-xl text-sm text-foreground placeholder-muted/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 resize-none"
              maxLength={500}
            />

            <div className="flex items-center justify-end gap-3 mt-4">
              <button
                onClick={handleCancelNote}
                disabled={isSubmittingNote}
                className="px-4 py-2.5 text-sm font-medium text-muted hover:text-foreground bg-surface border border-border rounded-xl transition-all duration-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitNote}
                disabled={isSubmittingNote}
                className="px-4 py-2.5 text-sm font-semibold text-background bg-accent rounded-xl hover:bg-accent-hover transition-all duration-200 disabled:opacity-50 shadow-lg shadow-accent/20"
              >
                {isSubmittingNote ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : (
                  'Save'
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
