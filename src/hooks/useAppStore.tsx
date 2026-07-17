import { useContext } from "react"
import { AppStoreContext, type AppStore } from "../stores/app-store"
import { useStore } from "zustand"

export const useAppStore = <T,>(
  selector: (store: AppStore) => T,
): T => {
  const appStoreContext = useContext(AppStoreContext)
  if (!appStoreContext) {
    throw new Error(`useAppStore must be used within AppStoreContext`)
  }

  return useStore(appStoreContext, selector)
}