import { NextResponse } from 'next/server';
import { auth } from '../../../auth';
import { db } from '../../../db';
import { savedRecipes } from '../../../db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userSavedRecipes = await db
    .select()
    .from(savedRecipes)
    .where(eq(savedRecipes.userId, session.user.id))
    .orderBy({ createdAt: 'desc' });

  return NextResponse.json(userSavedRecipes);
}
