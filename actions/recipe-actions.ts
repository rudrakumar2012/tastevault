'use server'

import { revalidatePath } from 'next/cache';
// We will uncomment these once your Drizzle DB is fully set up!
// import { db } from '../db';
// import { recipes } from '../db/schema';

export async function saveApiRecipe(title: string, category: string) {
  const description = `A delicious ${category} dish discovered via TasteVault.`;

  console.log(`Simulating saving to DB: ${title} - ${description}`);

  // TODO: Re-enable this when Neon DB is ready
  // await db.insert(recipes).values({
  //   title,
  //   description,
  // });

  // Refreshes the page data silently
  revalidatePath('/'); 
}