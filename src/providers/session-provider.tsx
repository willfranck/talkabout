"use client"
import { createContext, useState, useEffect, useCallback } from "react"
import { createClient } from "@utils/supabase/client"
import { Session } from "@supabase/supabase-js"


export type SessionContextProps = {
  session: Session | null
  isSessionLoading: boolean
}

export const SessionContext = createContext<SessionContextProps>({
  session: null,
  isSessionLoading: true
})

export function SupabaseSessionProvider({ 
  children, 
  initialSession 
}: { 
  children: React.ReactNode, 
  initialSession?: Session | null 
}) {
  const [session, setSession] = useState<Session | null>(initialSession || null)
  const [isSessionLoading, setIsSessionLoading] = useState(!initialSession)
  const supabase = createClient()

  // Internal refresh function
  const refreshSessionInternal = useCallback(async () => {
    try {
      setIsSessionLoading(true)
      const { data: { session: freshSession } } = await supabase.auth.getSession()
      setSession(freshSession)
    } finally {
      setIsSessionLoading(false)
    }
  }, [supabase])

  // Listen for auth changes and refresh automatically
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setIsSessionLoading(true)
      
      switch(event) {
        case "SIGNED_IN":
          setSession(newSession)
          break
        case "SIGNED_OUT":
          setSession(null)
          break
        case "TOKEN_REFRESHED":
          setSession(newSession)
          break
        case "USER_UPDATED":
          await refreshSessionInternal()
          break
        default:
          await refreshSessionInternal()
      }
      
      setIsSessionLoading(false)
    })

    if (!initialSession) {
      refreshSessionInternal()
    }

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, initialSession, refreshSessionInternal])

  return (
    <SessionContext.Provider value={{ session, isSessionLoading }}>
      {children}
    </SessionContext.Provider>
  )
}
