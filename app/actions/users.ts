"use server"

import { handleError } from "@/lib/utils";
import { createClient } from "../auth/server";
import { prisma } from "@/lib/prisma";

export async function loginUserAction(email: string, password: string) {
    try {
        const { auth } = await createClient();

        const { error } = await auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;

        return {
            errorMessage: null,
        };

    } catch (error) {
        return handleError(error);
    }
}

export async function logoutUserAction() {
    try {
        const { auth } = await createClient();

        const { error } = await auth.signOut();

        if (error) throw error;

        return {
            errorMessage: null,
        };

    } catch (error) {
        return handleError(error);
    }
}

export async function registerUserAction(email: string, password: string) {
    try {
        const { auth } = await createClient();

        const { data, error } = await auth.signUp({
            email,
            password,
        });
        if (error) throw error;

        let userId = data.user?.id;
        if (!userId) throw new Error("User ID not found after registration");

        await prisma.user.create({
            data: {
                id: userId,
                email: email,
            },
        });
        return {
            errorMessage: null,
        };

    } catch (error) {
        return handleError(error);
    }
}

export async function ensureUserExists() {
  const { auth } = await createClient();
  const { data, error } = await auth.getUser();
  
  if (error || !data.user) {
    console.error("Authentication error:", error?.message);
    return null;
  }

  const supabaseUser = data.user;

  try {
    // Upsert with explicit ID from Supabase
    const dbUser = await prisma.user.upsert({
      where: { id: supabaseUser.id },
      update: {
        email: supabaseUser.email!,
        // updatedAt is automatic with @updatedAt
      },
      create: {
        id: supabaseUser.id,  // Explicitly set from Supabase
        email: supabaseUser.email!,
        // createdAt is automatic with @default(now())
      }
    });
    
    return dbUser;
  } catch (e: any) {
    if (e.code === 'P2002') {
      // Unique constraint violation on email
      console.error('User sync error: Email already exists with different ID');
      console.error('Supabase ID:', supabaseUser.id);
      console.error('Email:', supabaseUser.email);
      
      // Find the conflicting user
      const existing = await prisma.user.findUnique({
        where: { email: supabaseUser.email! }
      });
      console.error('Existing DB ID:', existing?.id);
      
      throw new Error('User synchronization conflict. Please contact support.');
    }
    throw e;
  }
}