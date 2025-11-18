

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })


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
  const AuthRoutes = ['/login', '/sign-up', '/reset-password'];
  if (AuthRoutes.includes(request.nextUrl.pathname)) {

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_BASE_URL));
    }
  }

  const { searchParams, pathname } = new URL(request.url);

  if (!searchParams.get('noteId') && pathname === '/') {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { newestNoteId } = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/notes/get-newest?userId=${user.id}`)
        .then(res => res.json());

      if (newestNoteId) {
        return NextResponse.redirect(new URL(`/?noteId=${newestNoteId}`, process.env.NEXT_PUBLIC_BASE_URL));
      }
      else {
        const { noteId } = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/notes/create-new?userId=${user.id}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )
          .then(res => res.json());
        return NextResponse.redirect(new URL(`/?noteId=${noteId}`, process.env.NEXT_PUBLIC_BASE_URL));
      }
    }
  }

  return supabaseResponse
}