import { useContext } from "react"
import { SessionContext, SessionContextProps } from "@providers/session-provider"
import { SnackbarContext, SnackbarContextProps } from "@providers/mui-snackbar-provider"

/* eslint-disable @typescript-eslint/no-explicit-any */
const useIsMobileOS = (): boolean => {
  if (typeof window !== "undefined") {
    const userAgent = navigator.userAgent || (window as any).opera

    const isIOS = /iPad|iPhone|iPod/.test(userAgent)
    const isAndroid = /android/i.test(userAgent)
    
    return isIOS || isAndroid
  }
  return false
}

const useIsElectron = (): boolean => {
  return (
    typeof window !== "undefined" &&
    window.process?.versions?.electron !== "undefined"
  )
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
  useSession,
  useSnackbar
}
