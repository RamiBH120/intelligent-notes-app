import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })
  
  const origin = request.nextUrl.origin;


  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value }) => supabaseResponse.cookies.set(name, value))
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: Don't remove getClaims()
  const isAuthRoute =
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/sign-up";

  // Helper: call supabase.auth.getUser() safely. Some versions of the
  // GoTrue client throw an AuthSessionMissingError when the JWT points to a
  // non-existent session (for example the session row was removed). If that
  // happens inside middleware it can cause a 500. We catch and handle it
  // gracefully and treat the request as unauthenticated.
  async function safeGetUser() {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) return { user: null, error };
      return { user: data?.user ?? null, error: null };
    } catch (err: any) {
      // Detect common shapes for the session-missing error. We avoid a hard
      // dependency on the internal error class and instead check name/code.
      const isSessionMissing =
        err?.name === 'AuthSessionMissingError' ||
        err?.code === 'session_not_found' ||
        /session_not_found/i.test(err?.message || '');

      if (isSessionMissing) {
        // Heuristically clear Supabase-related cookies to avoid repeated
        // failing requests. We look for cookie names that start with common
        // Supabase prefixes (sb- / supabase) and expire them.
        try {
          for (const c of request.cookies.getAll()) {
            if (c.name.startsWith('sb-') || c.name.startsWith('supabase')) {
              supabaseResponse.cookies.set(c.name, '', { expires: new Date(0) });
            }
          }
        } catch (e) {
          // Do not let cookie-clearing failures block the request.
          console.warn('Failed to clear supabase cookies in middleware', e);
        }

        return { user: null, error: err };
      }

      // Unknown error: log and return null user so middleware continues.
      console.warn('Unexpected error in supabase.auth.getUser()', err);
      return { user: null, error: err };
    }
  }

  if (isAuthRoute) {
    const { user } = await safeGetUser();
    if (user) {
      return NextResponse.redirect(new URL("/", origin));
    }
  }

  const { searchParams, pathname } = new URL(request.url);

  // If the request contains an email verification code, redirect to account-verified
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorCode = searchParams.get("error_code");

  if (code) {
    const dest = new URL("/account-verified", origin);
    dest.searchParams.set("code", code);
    return NextResponse.redirect(dest);
  }

  // If the request contains an OTP expired error, redirect to link-expired
  if (error && errorCode === "otp_expired") {
    const dest = new URL("/link-expired", origin);
    const desc = searchParams.get("error_description");
    if (desc) dest.searchParams.set("error_description", desc);
    return NextResponse.redirect(dest);
  }

  // When visiting root, enforce auth: redirect anonymous users to /login,
  // otherwise perform the existing noteId redirect/creation for signed-in users.
  if (pathname === "/") {
    const { user } = await safeGetUser();

    if (!user) {
      return NextResponse.redirect(new URL("/login", origin));
    }

    if (!searchParams.get("noteId")) {
      if (user) {
        const { newestNoteId } = await fetch(
          `${origin}/api/notes/get-newest?userId=${user.id}`,
        ).then((res) => res.json());

        if (newestNoteId) {
          const url = request.nextUrl.clone();
          url.searchParams.set("noteId", newestNoteId);
          return NextResponse.redirect(url);
        } else {
          const { noteId } = await fetch(
            `${origin}/api/notes/create-new?userId=${user.id}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            },
          ).then((res) => res.json());
          const url = request.nextUrl.clone();
          url.searchParams.set("noteId", noteId);
          return NextResponse.redirect(url);
        }
      }
    }
  }

  return supabaseResponse
}
