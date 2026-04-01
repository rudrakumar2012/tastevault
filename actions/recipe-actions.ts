'use server'

import { revalidatePath } from 'next/cache';
import { auth } from '../auth';
import { db } from '../db';
import { savedRecipes } from '../db/schema';
import { eq } from 'drizzle-orm';

export async function saveApiRecipe(
  title: string,
  category: string,
  mealId: string,
  image?: string,
  note?: string
) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error('Unauthorized: Must be logged in to save recipes');
  }

  const userId = session.user.id;

  // Check if already saved
  const existing = await db
    .select()
    .from(savedRecipes)
    .where(eq(savedRecipes.userId, userId), eq(savedRecipes.mealId, mealId))
    .limit(1);

  if (existing.length > 0) {
    // Already saved, update note if provided
    if (note !== undefined) {
      await db
        .update(savedRecipes)
        .set({ note: note.trim() || null })
        .where(eq(savedRecipes.userId, userId), eq(savedRecipes.mealId, mealId));
      revalidatePath('/dashboard');
      return { success: true, message: 'Note updated' };
    }
    return { success: true, message: 'Recipe already saved' };
  }

  // Insert new saved recipe
  await db.insert(savedRecipes).values({
    userId,
    mealId,
    title,
    image: image || null,
    category: category || null,
    note: note?.trim() || null,
  });

  // Refreshes the page data silently
  revalidatePath('/');
  revalidatePath('/my-kitchen');

  return { success: true, message: 'Recipe saved to vault' };
}

export async function unsaveRecipe(mealId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error('Unauthorized: Must be logged in to unsave recipes');
  }

  const userId = session.user.id;

  await db
    .delete(savedRecipes)
    .where(eq(savedRecipes.userId, userId), eq(savedRecipes.mealId, mealId));

  revalidatePath('/');
  revalidatePath('/my-kitchen');

  return { success: true, message: 'Recipe removed from vault' };
}

export async function updateRecipeNote(mealId: string, note: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error('Unauthorized: Must be logged in to update notes');
  }

  const userId = session.user.id;

  await db
    .update(savedRecipes)
    .set({ note: note.trim() || null })
    .where(eq(savedRecipes.userId, userId), eq(savedRecipes.mealId, mealId));

  revalidatePath('/my-kitchen');

  return { success: true, message: 'Note updated' };
}

