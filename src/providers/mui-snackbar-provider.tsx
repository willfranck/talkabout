"use client"
import React, { useState, createContext } from "react"
import {
  Snackbar,
  Alert
} from "@mui/material"


interface SnackbarContextProps {
  showMessage: (type: "info" | "success" | "warning" | "error", message: string) => void
}

export const SnackbarContext = createContext<SnackbarContextProps>({ showMessage: () => {} })

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarSeverity, setSnackbarSeverity] = useState<"info" | "success" | "warning" | "error">("info")
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const showMessage = (type: "info" | "success" | "warning" | "error", message: string) => {
    setSnackbarSeverity(type)
    setSnackbarMessage(message)
    setSnackbarOpen(true)
  }
  const handleClose = () => setSnackbarOpen(false)

  return (
    <SnackbarContext.Provider value={{ showMessage }}>
      {children}
      <Snackbar
        open={snackbarOpen}
        onClose={handleClose}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ top: {xs: "3.75rem", sm: "5rem"} }}
      >
        <Alert
          severity={snackbarSeverity}
          onClose={handleClose}
          sx={{ width: "100%", maxWidth: "18rem" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  )
}
