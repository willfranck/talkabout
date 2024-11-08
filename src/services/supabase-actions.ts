"use server"
import { SupabaseClient } from "@supabase/supabase-js"
import { createClient } from "@/utils/supabase/server"
import { 
  SupabaseRes, 
  SupabaseUser, 
  SupabaseSession,
  UpdateableThreadColumns, 
  ChatThread,
  ChatMessage,
  transformChatThread,
  transformChatMessage 
} from "@types"
import { revalidatePath } from "next/cache"


async function logIn(formData: FormData, threads: ChatThread[], messages: ChatMessage[]): Promise<SupabaseRes> {
  const supabase = await createClient()

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  const { data: { user }, error } = await supabase.auth.signInWithPassword(data)
  if (error) {
    return { success: false, message: error.message }
  }

  if (user) {
    const { error: messageError } = await pushAllMessages(user.id, threads, messages, supabase)
    if (messageError) {
      return { success: false, message: messageError }
    }
  }

  revalidatePath("/", "layout")
  return { success: true, user: user as SupabaseUser }
}

async function signUp(formData: FormData, threads: ChatThread[], messages: ChatMessage[]): Promise<SupabaseRes> {
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

  if (user) {
    const { error: messageError } = await pushAllMessages(user.id, threads, messages, supabase)
    if (messageError) {
      return { success: false, message: messageError }
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

async function getUser(client?: SupabaseClient): Promise<SupabaseRes> {
  const supabase = client || await createClient()
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

async function pushAllMessages(
  userId: string, 
  threads: ChatThread[], 
  messages: ChatMessage[], 
  client?: SupabaseClient
): Promise<SupabaseRes> {
  const supabase = client || await createClient()
  for (const thread of threads) {
    const { data: threadData, error: threadError } = await supabase
      .from("chat_threads")
      .upsert({
        user_id: userId,
        local_id: thread.id,
        topic: thread.topic,
        category: thread.category,
        created: thread.created,
        last_active: thread.lastActive,
      })
      .select()
      .single()

    if (threadError) {
      return { success: false, message: threadError.message }
    }

    const threadMessages = messages.filter(message => message.threadId === thread.id)
    for (const message of threadMessages) {
      const { error: messageError } = await supabase
        .from("chat_messages")
        .upsert({
          local_id: message.id,
          thread_id: threadData.id,
          local_thread_id: message.threadId,
          role: message.role,
          content: message.content,
          timestamp: message.timestamp
        })

      if (messageError) {
        return { success: false, message: messageError.message }
      }
    }
  }
  return { success: true }
}

async function getAllMessages(userId: string): Promise<SupabaseRes> {
  const supabase = await createClient()
  const { data: threadData, error: threadError } = await supabase
    .from("chat_threads")
    .select("*")
    .eq("user_id", userId)
    .order("created", { ascending: true })

  if (threadError) {
    return { success: false, message: threadError.message }
  }
  if (!threadData) {
    return { success: false, message: "Thread not found" }
  }

  const { data: messageData, error: messageError } = await supabase
    .from("chat_messages")
    .select("*")
    .in("thread_id", threadData.map((t) => t.id))
    .order("timestamp", { ascending: true })

  if (messageError) {
    return { success: false, message: messageError.message }
  }

  return { success: true, chatThreads: threadData, chatMessages: messageData }
}

async function saveThread(userId: string, thread: ChatThread): Promise<SupabaseRes> {
  const supabase = await createClient()
  const supabaseThread = await transformChatThread(userId, thread)
  const { error: threadError } = await supabase
    .from("chat_threads")
    .upsert(supabaseThread)

  if (threadError) {
    return { success: false, message: threadError.message }
  }

  return { success: true }
}

async function deleteThread(userId: string, thread: ChatThread): Promise<SupabaseRes> {
  const supabase = await createClient()
  const { error } = await supabase
    .from("chat_threads")
    .delete()
    .eq("user_id", userId)
    .eq("local_id", thread.id)

  if (error) {
    return { success: false, message: error.message }
  }

  return { success: true }
}

async function updateDbThread(
  userId: string, 
  thread: ChatThread, 
  value: Partial<UpdateableThreadColumns>
): Promise<SupabaseRes> {
  const supabase = await createClient()
  const { data: threadToUpdate, error: threadError } = await supabase
    .from("chat_threads")
    .select("id")
    .eq("user_id", userId)
    .eq("local_id", thread.id)
    .single()
    
  if (threadError) {
    return { success: false, message: threadError.message }
  }
  if (!threadToUpdate) {
    return { success: false, message: "No thread found" }
  }

  const { error: updateError } = await supabase
    .from("chat_threads")
    .update(value)
    .eq("id", threadToUpdate.id)

  if (updateError) {
    return { success: false, message: updateError.message }
  }

  return { success: true }
}

async function saveMessage(userId: string, message: ChatMessage): Promise<SupabaseRes> {
  const supabase = await createClient()
  const { data: thread, error: threadError  } = await supabase
    .from("chat_threads")
    .select("id")
    .eq("user_id", userId)
    .eq("local_id", message.threadId)
    .single()

  if (threadError) {
    return { success: false, message: threadError.message }
  }
  if (!thread) {
    return { success: false, message: "Thread not found"}
  }

  const supabaseMessage = await transformChatMessage(thread.id, message)
  const { error: messageError } = await supabase
    .from("chat_messages")
    .upsert(supabaseMessage)
  
  if (messageError) {
    return { success: false, message: messageError.message }
  }

  return { success: true }
}

async function deleteMessages(userId: string, message: ChatMessage): Promise<SupabaseRes> {
  const supabase = await createClient()
  const { data: thread, error: threadError  } = await supabase
    .from("chat_threads")
    .select("id")
    .eq("user_id", userId)
    .eq("local_id", message.threadId)
    .single()

  if (threadError) {
    return { success: false, message: threadError.message }
  }
  if (!thread) {
    return { success: false, message: "Thread not found"}
  }

  const supabaseMessage = await transformChatMessage(thread.id, message)
  const { data: messagesToDelete } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("thread_id", thread.id)
    .gte("timestamp", supabaseMessage.timestamp)
    .order('timestamp', { ascending: true })
  
  if (messagesToDelete) {
    const { error: messageError } = await supabase
      .from("chat_messages")
      .delete()
      .in("id", messagesToDelete.map(msg => msg.id))
      
    if (messageError) {
      return { success: false, message: messageError.message }
    }
  }

  return { success: true }
}


export {
  logIn,
  signUp,
  signOut,
  getSession,
  getUser,
  updateUser,
  deleteUser,
  pushAllMessages,
  getAllMessages,
  saveThread,
  deleteThread,
  updateDbThread,
  saveMessage,
  deleteMessages
}
