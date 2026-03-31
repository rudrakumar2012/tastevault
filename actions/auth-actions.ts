'use server'

import { hash } from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

export async function registerUser(name: string, email: string, password: string) {
  // Check if user already exists
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing.length > 0) {
    throw new Error('User with this email already exists');
  }

  // Hash the password
  const hashedPassword = await hash(password, 10);

  // Create new user
  await db.insert(users).values({
    name,
    email,
    password: hashedPassword,
    emailVerified: null, // Not verified yet
    image: null,
  });

  revalidatePath('/');
  revalidatePath('/auth/signin');

  return { success: true, message: 'User registered successfully' };
}
