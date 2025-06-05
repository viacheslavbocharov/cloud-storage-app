import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import VerifyRegistration from '../pages/VerifyRegistration';
import DashboardPage from '../pages/DashboardPage';

const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/pre-register', element: <RegisterPage /> },
  { path: '/verify-registration', element: <VerifyRegistration /> },
  { path: '/dashboard', element: <DashboardPage /> },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
