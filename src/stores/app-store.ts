import { createStore } from 'zustand/vanilla';
import { persist } from 'zustand/middleware';
import { createContext } from 'react';

export type AppStoreState = {
  user: User | null,
  token: string | null,
  isAuthenticated: boolean,
}

export type AppStoreActions = {
  setUser: (user: User | null) => void,
  setToken: (token: string | null) => void,
  setIsAuthenticated: (isAuthenticated: boolean) => void,
}

export type AppStore = AppStoreState & AppStoreActions

export const defaultInitState: AppStoreState = {
  user: null,
  token: null,
  isAuthenticated: false,
}

export const createAppStore = (
  initState: AppStoreState = defaultInitState,
) => {
  return createStore<AppStore>()(
    persist((set) => ({
    ...initState,
    setUser: (user) => set(() => ({ user })),
    setToken: (token) => set(() => ({ token })),
    setIsAuthenticated: (isAuthenticated) => set(() => ({ isAuthenticated })),
  }), {
    name: 'app-store', // name of the item in storage
    partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }), // use localStorage for persistence
  })
  );
}

export type AppStoreApi = ReturnType<typeof createAppStore>

export const AppStoreContext = createContext<AppStoreApi | undefined>(
  undefined,
)
