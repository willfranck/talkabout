import { createBrowserClient } from "@supabase/ssr"


async function createClient() {
  return createBrowserClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  )
}

export {
  createClient
}