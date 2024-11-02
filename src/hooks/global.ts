import { useState, useEffect, useContext } from "react"
import { User, transformSupabaseUser } from "@types"
import { getUser } from "@services/supabase-actions"
import { useThreads } from "./chat"
import { SessionContext, SessionContextProps } from "@providers/session-provider"
import { SnackbarContext, SnackbarContextProps } from "@providers/mui-snackbar-provider"

/* eslint-disable @typescript-eslint/no-explicit-any */
const useIsMobileOS = (): boolean => {
  const [isMobileOS, setIsMobileOS] = useState(false)

  useEffect(() => {
    const userAgent = navigator.userAgent || (window as any).opera
    const isIOS = /iPad|iPhone|iPod/.test(userAgent)
    const isAndroid = /android/i.test(userAgent)
    
    setIsMobileOS(isIOS || isAndroid)
  }, [])

  return isMobileOS
}

const useIsElectron = (): boolean => {
  const [isElectron, setIsElectron] = useState(false)

  useEffect(() => {
    const isElectronEnv = Boolean(window.process?.versions?.electron)
    setIsElectron(isElectronEnv)
  }, [])

  return isElectron
}

interface UserReturn {
  user: User | null
  refreshUser: () => Promise<void>
}

const useUser = (): UserReturn => {
  const [user, setUser] = useState<User | null>(null)
  const userChats = useThreads()

  const getUserData = async () => {
    const res = await getUser()
    if (res.success && res.user) {
      const userData = transformSupabaseUser(res.user, userChats)
      setUser(userData)
    }
  }

  useEffect(() => {
    getUserData()
  }, [])

  const refreshUser = async () => {
    await getUserData()
  }

  return { user, refreshUser }
}

const useSession = (): SessionContextProps => {
  const context = useContext(SessionContext)
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider")
  }
  return context
}

const useSnackbar = (): SnackbarContextProps => {
  const context = useContext(SnackbarContext)
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider")
  }
  return context
}

export {
  useIsMobileOS,
  useIsElectron,
  useUser,
  useSession,
  useSnackbar
}
