"use server"
import { revalidatePath } from "next/cache"
import { createClient } from "@/utils/supabase/server"
import { SupabaseRes, SupabaseUser, SupabaseSession, ChatThread } from "@types"


async function logIn(formData: FormData): Promise<SupabaseRes> {
  const supabase = await createClient()

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  const { data: { user }, error } = await supabase.auth.signInWithPassword(data)
  if (error) {
    return { success: false, message: error.message }
  }

  revalidatePath("/", "layout")
  return { success: true, user: user as SupabaseUser }
}

async function signUp(formData: FormData, chatHistory: ChatThread[]): Promise<SupabaseRes> {
  const supabase = await createClient()

  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string | null
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const { data: { user }, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName
      }
    }
  })
  if (signUpError) {
    return { success: false, message: signUpError.message }
  }

  for (const thread of chatHistory) {
    const { data: threadData, error: threadError } = await supabase
      .from("chat_threads")
      .insert({
        user_id: user?.id,
        local_id: thread.id,
        topic: thread.topic,
        category: thread.category,
        created: thread.created,
        last_active: thread.lastActive,
        selected: thread.selected
      })
      .select()
      .single()

    if (threadError) {
      return { success: false, message: threadError.message }
    }

    const messages = thread.messages.map(message => ({
      thread_id: threadData.id,
      local_id: message.id,
      role: message.role,
      content: message.content,
      timestamp: message.timestamp
    }))

    const { error: messageError } = await supabase
      .from("chat_messages")
      .insert(messages)

    if (messageError) {
      return { success: false, message: messageError.message }
    }
  }

  revalidatePath("/", "layout")
  return { success: true, user: user as SupabaseUser }
}

async function signOut(): Promise<SupabaseRes> {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()
  if (error) {
    return { success: false, message: error.message }
  }
  return { success: true }
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

async function updateUser(formData: FormData): Promise<SupabaseRes> {
  const supabase = await createClient()

  const newFirstName = formData.get("firstName") as string
  const newLastName = formData.get("lastName") as string | null
  const newEmail = formData.get("email") as string

  const { data: { user }, error } = await supabase.auth.updateUser({
    email: newEmail,
    data: {
      first_name: newFirstName,
      last_name: newLastName,
    }
  })
  if (error) {
    return { success: false, message: error.message }
  }
  return { success: true, user: user as SupabaseUser }
}

async function deleteUser(): Promise<SupabaseRes> {
  const supabase = await createClient()
  const { error: deleteError } = await supabase.auth.admin.deleteUser(
    (await supabase.auth.getUser()).data.user?.id as string
  )
  if (deleteError) {
    return { success: false, message: deleteError.message }
  }

  const { error: signOutError } = await supabase.auth.signOut()
  if (signOutError) {
    return { success: false, message: signOutError.message }
  }

  return { success: true }
}

async function getMessages(userId: string): Promise<SupabaseRes> {
  const supabase = await createClient()

  const { data: threadData, error: threadError } = await supabase
    .from("chat_threads")
    .select("*")
    .eq("user_id", userId)
    .order("created", { ascending: true })

  if (threadError) {
    return { success: false, message: threadError.message }
  }

  const { data: messageData, error: messageError } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("thread_id", threadData?.map((t) => t.id))
    .order("timestamp", { ascending: true })

  if (messageError) {
    return { success: false, message: messageError.message }
  }

  return { success: true, chatThreads: threadData, chatMessages: messageData }
}


export {
  logIn,
  signUp,
  signOut,
  getSession,
  getUser,
  updateUser,
  deleteUser,
  getMessages
}
