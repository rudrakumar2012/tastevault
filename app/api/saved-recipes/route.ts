import { NextResponse } from 'next/server';
import { auth } from '../../../auth';
import { db } from '../../../db';
import { savedRecipes } from '../../../db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  const userSavedRecipes = await db
    .select()
    .from(savedRecipes)
    .where(eq(savedRecipes.userId, userId))
    .orderBy(desc(savedRecipes.createdAt));

  return NextResponse.json(userSavedRecipes);
}
