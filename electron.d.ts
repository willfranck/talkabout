declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        send: (channel: string, ...args: unknown[]) => void
        on: (channel: string, listener: (event: unknown, ...args: unknown[]) => void) => void
      }
    }
  }
}

export {}