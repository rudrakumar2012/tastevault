import { auth } from '../../../auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { db } from '../../../db';
import { savedRecipes } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import RecipeDetailSaveButton from '../../../components/RecipeDetailSaveButton';

export default async function RecipeDetail({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();

  if (!session?.user) {
    // Redirect to sign-in page with callback URL to return after auth
    const { id } = await params;
    redirect(`/api/auth/signin?callbackUrl=/recipe/${id}`);
  }

  const { id } = await params;

  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`, {
    next: { revalidate: 3600 } // Cache for 1 hour
  });

  const data = await res.json();
  const meal = data.meals ? data.meals[0] : null;

  if (!meal) {
    return (
      <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-surface border border-border mb-6">
            <svg className="w-10 h-10 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">Recipe Not Found</h1>
          <p className="text-muted mb-8">The recipe you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-background font-semibold rounded-full hover:bg-accent-hover transition-all duration-200 shadow-lg shadow-accent/20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Discovery
          </Link>
        </div>
      </main>
    );
  }

  // Check if recipe is saved by user
  let isSaved = false;
  if (session?.user) {
    const existing = await db
      .select()
      .from(savedRecipes)
      .where(
        eq(savedRecipes.userId, session.user.id),
        eq(savedRecipes.mealId, meal.idMeal)
      )
      .limit(1);
    isSaved = existing.length > 0;
  }

  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    if (ingredient && ingredient.trim() !== '') {
      ingredients.push({ ingredient, measure });
    }
  }

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Back Navigation */}
      <Link
        href="/discover"
        className="inline-flex items-center gap-2 text-muted hover:text-accent transition-colors mb-8 group"
      >
        <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back to Discovery</span>
      </Link>

      {/* Recipe Header */}
      <div className="mb-12">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="px-4 py-2 text-sm font-medium bg-accent/10 text-accent border border-accent/20 rounded-full">
            {meal.strCategory}
          </span>
          <span className="px-4 py-2 text-sm font-medium bg-surface border border-border rounded-full text-muted">
            {meal.strArea}
          </span>

          {/* Save Button */}
          <div className="ml-auto">
            <RecipeDetailSaveButton
              recipe={{
                idMeal: meal.idMeal,
                strMeal: meal.strMeal,
                strCategory: meal.strCategory,
                strMealThumb: meal.strMealThumb,
              }}
              initialIsSaved={isSaved}
            />
          </div>
        </div>

        <h1 className="text-4xl lg:text-6xl font-bold text-foreground tracking-tight mb-6">
          {meal.strMeal}
        </h1>

        {/* Hero Image */}
        <div className="relative rounded-2xl overflow-hidden mb-12 shadow-2xl">
          <img
            src={meal.strMealThumb}
            alt={meal.strMeal}
            className="w-full h-[400px] lg:h-[500px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Ingredients Column */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <div className="bg-surface border border-border rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-foreground">Ingredients</h2>
              </div>

              <ul className="space-y-3">
                {ingredients.map(({ ingredient, measure }, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-sm text-muted hover:text-foreground transition-colors"
                  >
                    <svg className="w-2 h-2 mt-2 rounded-full bg-accent flex-shrink-0" fill="currentColor" viewBox="0 0 6 6">
                      <circle cx="3" cy="3" r="3" />
                    </svg>
                    <span>
                      <span className="font-medium text-foreground">{measure.trim()}</span>
                      {measure && ' '}
                      <span className="capitalize">{ingredient}</span>
                    </span>
                  </li>
                ))}
              </ul>

              {ingredients.length === 0 && (
                <p className="text-muted text-sm">No ingredients listed for this recipe.</p>
              )}
            </div>
          </div>
        </div>

        {/* Preparation Instructions Column */}
        <div className="lg:col-span-2">
          <div className="bg-surface border border-border rounded-2xl p-6 lg:p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-foreground">Preparation</h2>
            </div>

            <div className="prose prose-invert max-w-none">
              {meal.strInstructions ? (
                <div className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {meal.strInstructions}
                </div>
              ) : (
                <p className="text-muted">No preparation instructions available for this recipe.</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-10 pt-6 border-t border-border flex flex-wrap gap-4">
              <Link
                href="/discover"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-background font-semibold rounded-full hover:bg-accent-hover transition-all duration-200 shadow-lg shadow-accent/20 hover:shadow-accent/30"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Find More Recipes
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
