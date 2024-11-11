"use client"
import { useRef } from "react"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import { createStore } from "@redux/store"
import { LoadingDialog } from "@ui/mui-elements"


export function ReduxProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const storeRef = useRef<ReturnType<typeof createStore>>()
  if (!storeRef.current) {
    storeRef.current = createStore()
  }

  return (
    <Provider store={storeRef.current.store}>
      <PersistGate 
        loading={
          <LoadingDialog open={true} message="Reticulating splines..." />
        } 
        persistor={storeRef.current.persistor}
      >
        {children}
      </PersistGate>
    </Provider>
  )
}

export default ReduxProvider
