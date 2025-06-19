import { createClient } from '@supabase/supabase-js'

// Note: Replace with your actual Supabase URL and anon key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Auth helper functions
interface SignUpFormData {
  email: string;
  password: string;
  businessName: string;
  vendorName: string;
  phone: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export const authHelpers = {
  signUp: async (formData: SignUpFormData) => {
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          business_name: formData.businessName,
          vendor_name: formData.vendorName,
          phone: formData.phone,
          bank_name: formData.bankName,
          account_number: formData.accountNumber,
          account_name: formData.accountName
        }
      }
    })
    return { data, error }
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  resetPassword: async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email)
    return { data, error }
  },

  updatePassword: async (password: string) => {
    const { data, error } = await supabase.auth.updateUser({ password })
    return { data, error }
  }
}
