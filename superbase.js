import { createClient } from '@supabase/supabase-js'

// 🔧 Replace these with your Supabase project credentials
// Go to: https://supabase.com → Your Project → Settings → API
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co'
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
