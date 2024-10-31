"use server"
import { revalidatePath } from "next/cache"
import { createClient } from "@/utils/supabase/server"
import { SupabaseRes, SupabaseUser, SupabaseSession } from "@types"


async function logIn(formData: FormData): Promise<SupabaseRes> {
  const supabase = await createClient()

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)
  if (error) {
    console.log(error.message)
    return { success: false, message: error.message }
  }

  revalidatePath("/", "layout")
  return { success: true }
}

async function signUp(formData: FormData): Promise<SupabaseRes> {
  const supabase = await createClient()

  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string | null
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName
      }
    }
  })
  if (error) {
    console.log(error.message)
    return { success: false, message: error.message }
  }

  revalidatePath("/", "layout")
  return { success: true }
}

async function signOut(): Promise<SupabaseRes> {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()
  if (error) {
    return { success: false, message: error.message }
  }
  return { success: true }
}

async function getUser(): Promise<SupabaseRes> {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) {
    return { success: false, message: error.message }
  }
  if (user) {
    return { success: true, user: user as SupabaseUser }
  }
  return { success: false, message: "No User Found" }
}

async function getSession(): Promise<SupabaseRes> {
  const supabase = await createClient()
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) {
    return { success: false, message: error.message }
  }
  if (session) {
    return { success: true, session: session as SupabaseSession }
  }
  return { success: false, message: "No Session Found" }
}


export {
  logIn,
  signUp,
  signOut,
  getUser,
  getSession
}
