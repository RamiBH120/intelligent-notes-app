"use server";

import { getUser } from "../auth/server";

// Server action wrapper to let client components check server-side session
export async function getServerUser() {
  try {
    const user = await getUser();
    return {
      authenticated: Boolean(user),
    };
  } catch (err) {
    console.error("Error checking server user:", err);
    return {
      authenticated: false,
    };
  }
}
