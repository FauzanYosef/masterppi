import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://vfiikiikssljzqrkervl.supabase.co"

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmaWlraWlrc3NsanpxcmtlcnZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1MDQ3NDgsImV4cCI6MjA5MTA4MDc0OH0.hnpgBG9hk8ppo6q2zfM-r-EEBGIvi_adCzkvlbJydZw"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)