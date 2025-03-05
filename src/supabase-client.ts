import { createClient } from "@supabase/supabase-js";

const supabaseURL = import.meta.env.VITE_SUPABASE_URL as string
const supabaseANON = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase= createClient(supabaseURL, supabaseANON)