export const useAuth = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const toast = useToast()

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      navigateTo('/auth/login')
    } catch (error: any) {
      toast.add({
        title: 'Error signing out',
        description: error?.message || 'An error occurred while signing out',
        color: 'red'
      })
    }
  }

  return {
    user,
    signOut
  }
} 