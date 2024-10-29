"use server"
import { revalidatePath } from "next/cache"
import { createClient } from "@/utils/supabase/server"

interface SupabaseRes {
  success: boolean
  message?: string
  error?: string
}

async function login(formData: FormData): Promise<SupabaseRes> {
  const supabase = await createClient()

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)
  if (error) {
    console.log(error?.message)
    return { success: false, message: error?.message }
  }

  revalidatePath("/", "layout")
  return { success: true }
}

async function signup(formData: FormData): Promise<SupabaseRes> {
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
    console.log(error?.message)
    return { success: false, message: error?.message }
  }

  revalidatePath("/", "layout")
  return { success: true }
}


export {
  login,
  signup
}
