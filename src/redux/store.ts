import { configureStore } from "@reduxjs/toolkit"
import persistStore from "redux-persist/lib/persistStore"
import rootReducer from "./reducers"

export const createStore = () => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => 
      getDefaultMiddleware({ 
        serializableCheck: {
          ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"]
        }
      }),
  })
  const persistor = persistStore(store)

  return { store, persistor }
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof createStore>
export type AppDispatch = AppStore["store"]["dispatch"]
