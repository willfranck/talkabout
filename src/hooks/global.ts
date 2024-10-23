/* eslint-disable @typescript-eslint/no-explicit-any */
const useIsMobileOS = () => {
  if (typeof window !== "undefined") {
    const userAgent = navigator.userAgent || (window as any).opera

    const isIOS = /iPad|iPhone|iPod/.test(userAgent)
    const isAndroid = /android/i.test(userAgent)
    
    return isIOS || isAndroid
  }
}

export {
  useIsMobileOS
}
