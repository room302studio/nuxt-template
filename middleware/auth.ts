export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser()

  // Skip middleware for excluded routes
  const excludedRoutes = ['/auth/login', '/auth/confirm']
  if (excludedRoutes.includes(to.path)) {
    return
  }

  // Redirect to login if not authenticated
  if (!user.value) {
    return navigateTo('/auth/login')
  }
}) 