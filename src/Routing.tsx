import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import OnboardingPage from './pages/onboarding/page';
import LoginPage from './pages/login';
import RootLayout from './components/layouts/RootLayout';
import DashboardLayout from './components/layouts/DashboardLayout';
import DashboardPage from './pages/dashboard';
import PayoutsPage from './pages/payouts';
import PrintPage from './pages/print';
import NotFound from './pages/404';
import ReviewsPage from './pages/reviews';
import ReviewDetailPage from './pages/reviews/review';


const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
      {
        path: "onboarding",
        element: <OnboardingPage />,
      },
      {
        path: "print",
        element: <PrintPage />,
      },
      {
        path: "",
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            path: "dashboard",
            element: <DashboardPage />,
          },
        ],
      },
      {
        path: "reviews",
        element: <ReviewsPage />,
      },
      {
        path: "reviews/:id",
        element: <ReviewDetailPage />,
      },
      {
        path: "payouts",
        element: <PayoutsPage />,
      },
    ]
  },
]);

function App() {
  return (<RouterProvider router={router} />)
}

export default App
