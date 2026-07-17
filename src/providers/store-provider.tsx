
import { type ReactNode, useState } from 'react'
import { AppStoreContext, createAppStore } from '../stores/app-store'

export interface StoreProviderProps {
  children: ReactNode
}

export const AppStoreProvider = ({
  children,
}: StoreProviderProps) => {
  const [ appStore ] = useState(() => createAppStore())
  return (
    <AppStoreContext.Provider value={appStore}>
      {children}
    </AppStoreContext.Provider>
  )
}