"use server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"


async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)
  if (error) {
    console.log(error?.message)
  }

  revalidatePath("/", "layout")
  redirect("/chat")
}

async function signup(formData: FormData) {
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
  }

  revalidatePath("/", "layout")
  redirect("/chat")
}


export {
  login,
  signup
}
