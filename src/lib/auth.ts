import { auth } from './auth-config'

/**
 * Get the current session from the server
 * Use this in Server Components and API routes
 */
export async function getSession() {
  return await auth()
}

/**
 * Get the current user from the session
 * Returns the user object if logged in, null otherwise
 */
export async function getCurrentUser() {
  const session = await getSession()
  return session?.user ?? null
}

/**
 * Check if the user is authenticated
 */
export async function isAuthenticated() {
  const session = await getSession()
  return !!session?.user
}