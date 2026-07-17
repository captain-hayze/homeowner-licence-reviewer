import { AppStoreProvider } from "./store-provider"


export default function Providers({
  children,
}: {
    children: React.ReactNode
}) {
  return (
    <AppStoreProvider>
      {children}
    </AppStoreProvider>
  )
}