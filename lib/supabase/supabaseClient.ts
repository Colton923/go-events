import { createClient } from '@supabase/supabase-js'
import { Database } from 'types/supabase'
import type { SupabaseClient } from '@supabase/supabase-js'

export type SupabaseClientType = SupabaseClient<Database['public']['Tables']>

export const supabase: SupabaseClientType = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_KEY as string
)
