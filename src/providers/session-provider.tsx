"use client"
import { createContext, useState, useEffect, useCallback, useRef } from "react"
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
  
  // Track if Supabase is unreachable to stop retrying
  const isSupabaseUnreachable = useRef(false)
  const failedAttempts = useRef(0)

  // Clear localStorage tokens if connection fails
  const clearBadTokens = useCallback(() => {
    try {
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith('sb-') && key.includes('-auth-token')) {
          localStorage.removeItem(key)
        }
      })
      console.log('Cleared Supabase tokens due to connection failure')
    } catch (error) {
      console.error('Failed to clear tokens:', error)
    }
  }, [])

  // Check if error indicates Supabase is unreachable
  const isNetworkError = useCallback((error: any) => {
    const errorMessage = error?.message || String(error)
    return (
      errorMessage.includes('fetch failed') ||
      errorMessage.includes('ENOTFOUND') ||
      errorMessage.includes('network') ||
      errorMessage.includes('timeout')
    )
  }, [])

  // Internal refresh function with error handling
  const refreshSessionInternal = useCallback(async () => {
    // Don't retry if we know Supabase is down
    if (isSupabaseUnreachable.current) {
      setIsSessionLoading(false)
      return
    }

    try {
      setIsSessionLoading(true)
      const { data: { session: freshSession }, error } = await supabase.auth.getSession()
      
      if (error) {
        if (isNetworkError(error)) {
          failedAttempts.current++
          if (failedAttempts.current >= 2) {
            console.warn('Supabase appears to be unreachable. Stopping retry attempts.')
            isSupabaseUnreachable.current = true
            clearBadTokens()
          }
        }
        setSession(null)
      } else {
        // Success - reset failure tracking
        failedAttempts.current = 0
        isSupabaseUnreachable.current = false
        setSession(freshSession)
      }
    } catch (error) {
      if (isNetworkError(error)) {
        failedAttempts.current++
        if (failedAttempts.current >= 2) {
          console.warn('Supabase appears to be unreachable. Stopping retry attempts.')
          isSupabaseUnreachable.current = true
          clearBadTokens()
        }
      }
      setSession(null)
    } finally {
      setIsSessionLoading(false)
    }
  }, [supabase, clearBadTokens, isNetworkError])

  // Listen for auth changes
  useEffect(() => {
    if (isSupabaseUnreachable.current) {
      setIsSessionLoading(false)
      return
    }

    let subscription: { unsubscribe: () => void } | null = null
    
    try {
      const { data } = supabase.auth.onAuthStateChange(async (event, newSession) => {
        if (isSupabaseUnreachable.current) return

        setIsSessionLoading(true)
        
        try {
          switch(event) {
            case "SIGNED_IN":
              failedAttempts.current = 0
              isSupabaseUnreachable.current = false
              setSession(newSession)
              break
            case "SIGNED_OUT":
              setSession(null)
              break
            case "TOKEN_REFRESHED":
              failedAttempts.current = 0
              isSupabaseUnreachable.current = false
              setSession(newSession)
              break
            case "USER_UPDATED":
              await refreshSessionInternal()
              break
            default:
              await refreshSessionInternal()
          }
        } catch (error) {
          if (isNetworkError(error)) {
            console.warn('Auth state change failed - Supabase may be paused')
            isSupabaseUnreachable.current = true
          }
          setSession(null)
        } finally {
          setIsSessionLoading(false)
        }
      })
      
      subscription = data.subscription

      if (!initialSession) {
        refreshSessionInternal()
      }
    } catch (error) {
      if (isNetworkError(error)) {
        console.warn('Failed to set up auth listener - Supabase may be paused')
        isSupabaseUnreachable.current = true
      }
      setSession(null)
      setIsSessionLoading(false)
    }

    return () => {
      subscription?.unsubscribe()
    }
  }, [supabase, initialSession, refreshSessionInternal, isNetworkError])

  // Session check callback
  const checkAndRefreshSession = useCallback(async () => {
    // Don't check if we know it's down
    if (isSupabaseUnreachable.current || document.visibilityState !== 'visible') {
      return
    }

    setIsSessionLoading(true)
    try {
      const { data: { session: freshSession }, error } = await supabase.auth.getSession()
      
      if (error) {
        if (isNetworkError(error)) {
          console.warn('Session check failed - Supabase may be paused')
          isSupabaseUnreachable.current = true
          clearBadTokens()
        }
        setSession(null)
        return
      }
      
      if (freshSession?.expires_at) {
        const expiresAt = new Date(freshSession.expires_at * 1000)
        const isExpiringSoon = expiresAt.getTime() - Date.now() < 60000

        if (isExpiringSoon) {
          const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession()
          if (refreshError) {
            if (isNetworkError(refreshError)) {
              isSupabaseUnreachable.current = true
              clearBadTokens()
            }
            setSession(null)
          } else {
            failedAttempts.current = 0
            setSession(refreshedSession)
          }
        } else {
          failedAttempts.current = 0
          setSession(freshSession)
        }
      } else {
        setSession(freshSession)
      }
    } catch (error) {
      if (isNetworkError(error)) {
        console.warn('Session check failed - Supabase may be paused')
        isSupabaseUnreachable.current = true
        clearBadTokens()
      }
      setSession(null)
    } finally {
      setIsSessionLoading(false)
    }
  }, [supabase.auth, clearBadTokens, isNetworkError])

  // Call session check periodically (10 minutes) - only if Supabase is reachable
  useEffect(() => {
    if (isSupabaseUnreachable.current) return

    const intervalId = setInterval(() => {
      if (!isSupabaseUnreachable.current) {
        checkAndRefreshSession()
      }
    }, 10 * 60 * 1000)
    
    return () => clearInterval(intervalId)
  }, [checkAndRefreshSession])

  // Call session check after inactivity
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!isSupabaseUnreachable.current) {
        checkAndRefreshSession()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [checkAndRefreshSession])

  
  return (
    <SessionContext.Provider value={{ session, isSessionLoading }}>
      {children}
    </SessionContext.Provider>
  )
}
