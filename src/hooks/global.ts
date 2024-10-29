import { useContext } from "react"
import { SnackbarContext } from "@providers/mui-snackbar-provider"

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

const useSnackbar = () => {
  const context = useContext(SnackbarContext)
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider")
  }
  return context
}

export {
  useIsMobileOS,
  useIsElectron,
  useSnackbar
}
