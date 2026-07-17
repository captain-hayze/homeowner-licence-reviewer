import Providers from '../../providers';
import { Outlet } from 'react-router-dom';

export default function RootLayout() {
  return (
    <main className="min-h-full bg-white antialiased">
      <Providers>
        <Outlet />
      </Providers>
    </main>
  );
}
