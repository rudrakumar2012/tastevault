import { auth } from '../auth';
import { db } from '../db';
import { savedRecipes } from '../db/schema';
import { eq } from 'drizzle-orm';
import RecipeCard from '../components/RecipeCard';

export default async function Home({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const session = await auth();
  const params = await searchParams;
  const query = params.q || '';

  // THE FIX: If there's no search query, pick a random term so Discovery is always fresh!
  let fetchQuery = query;
  if (!query) {
    const randomTerms = ['chicken', 'beef', 'pasta', 'fish', 'dessert', 'pork', 'vegan', 'curry', 'lamb', 'cheese'];
    fetchQuery = randomTerms[Math.floor(Math.random() * randomTerms.length)];
  }

  // We add { cache: 'no-store' } to force Next.js to fetch fresh data on every refresh
  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${fetchQuery}`, {
    cache: 'no-store'
  });

  const data = await res.json();
  const recipes = data.meals || [];

  // Fetch user's saved recipe IDs if authenticated
  let savedRecipeIds: Set<string> = new Set();
  if (session?.user) {
    const userSaved = await db
      .select({ mealId: savedRecipes.mealId })
      .from(savedRecipes)
      .where(eq(savedRecipes.userId, session.user.id));
    savedRecipeIds = new Set(userSaved.map((s) => s.mealId));
  }

  return (
    <main style={{ padding: '40px', fontFamily: 'system-ui', color: '#E4E4E7', minHeight: '100vh' }}>
      <h1 style={{ color: '#69F6B8', margin: '0 0 10px 0' }}>
        {query ? `Search Results for "${query}"` : 'Discovery'}
      </h1>
      <p style={{ color: '#A1A1AA', marginBottom: '30px' }}>
        {recipes.length > 0 ? `Found ${recipes.length} recipes.` : `No recipes found for "${query}". Try another search!`}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {recipes.map((recipe: any) => (
          <RecipeCard
            key={recipe.idMeal}
            recipe={recipe}
            isSaved={savedRecipeIds.has(recipe.idMeal)}
          />
        ))}
      </div>
    </main>
  );
}