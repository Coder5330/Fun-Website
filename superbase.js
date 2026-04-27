import { createClient } from '@supabase/supabase-js'

// 🔧 Replace these with your Supabase project credentials
// Go to: https://supabase.com → Your Project → Settings → API
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5oenJja3JrcXBudWFydnF2ZmVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyOTEzNzQsImV4cCI6MjA5Mjg2NzM3NH0.Rwl9uBECem-qEiJfpia3xpo0pwlcH0IdLSlqf6NHVTQ'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
