"use client"
import React, { useState, createContext } from "react"
import {
  Snackbar,
  Alert
} from "@mui/material"


export type SnackbarContextProps = {
  showMessage: (
    type: "info" | "success" | "warning" | "error",
    message: string,
    duration: number
  ) => void
}

export const SnackbarContext = createContext<SnackbarContextProps>({ showMessage: () => {} })

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarSeverity, setSnackbarSeverity] = useState<"info" | "success" | "warning" | "error">("info")
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarDuration, setSnackbarDuration] = useState(0)
  const showMessage = (type: "info" | "success" | "warning" | "error", message: string, duration: number) => {
    setSnackbarSeverity(type)
    setSnackbarMessage(message)
    setSnackbarDuration(duration)
    setSnackbarOpen(true)
  }
  const handleClose = () => setSnackbarOpen(false)

  return (
    <SnackbarContext.Provider value={{ showMessage }}>
      {children}
      <Snackbar
        open={snackbarOpen}
        onClose={handleClose}
        autoHideDuration={snackbarDuration}
        anchorOrigin={{ 
          vertical: "top", 
          horizontal: "center" 
        }}
        sx={{ 
          top: {xs: "3.75rem", sm: "5rem"} 
        }}
      >
        <Alert
          severity={snackbarSeverity}
          onClose={handleClose}
          tabIndex={-1}
          sx={{ maxWidth: "20rem" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  )
}
