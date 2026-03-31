import { auth } from '../../../auth';
import { redirect } from 'next/navigation';

export default async function RecipeDetail({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();

  if (!session?.user) {
    // Redirect to sign-in page with callback URL to return after auth
    const { id } = await params;
    redirect(`/api/auth/signin?callbackUrl=/recipe/${id}`);
  }

  const { id } = await params;

  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
  const data = await res.json();
  const meal = data.meals ? data.meals[0] : null;

  if (!meal) return <div style={{ color: 'white', padding: '40px' }}>Recipe not found.</div>;

  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    if (ingredient && ingredient.trim() !== '') {
      ingredients.push(`${measure} ${ingredient}`);
    }
  }

  return (
    <main style={{ padding: '40px', fontFamily: 'system-ui', backgroundColor: '#0B0E14', color: '#E4E4E7', minHeight: '100vh', maxWidth: '800px', margin: '0 auto' }}>
      <a href="/" style={{ color: '#69F6B8', textDecoration: 'none', marginBottom: '20px', display: 'inline-block' }}>
        ← Back to Discovery
      </a>

      <h1 style={{ fontSize: '3rem', margin: '10px 0' }}>{meal.strMeal}</h1>
      <p style={{ color: '#A1A1AA', marginBottom: '30px' }}>{meal.strCategory} | {meal.strArea}</p>

      <img
        src={meal.strMealThumb}
        alt={meal.strMeal}
        style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '16px', marginBottom: '40px' }}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px' }}>
        <div style={{ backgroundColor: '#18181B', padding: '20px', borderRadius: '12px', height: 'fit-content' }}>
          <h3 style={{ color: '#69F6B8', marginTop: 0 }}>Ingredients</h3>
          <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
            {ingredients.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 style={{ color: '#69F6B8', marginTop: 0 }}>Preparation</h3>
          <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>
            {meal.strInstructions}
          </p>
        </div>
      </div>
    </main>
  );
}