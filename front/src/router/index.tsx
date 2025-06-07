// import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// import LandingPage from '../pages/LandingPage';
// import LoginPage from '../pages/LoginPage';
// import RegisterPage from '../pages/RegisterPage';
// import VerifyRegistration from '../pages/VerifyRegistration';
// import DashboardPage from '../pages/DashboardPage';

// const router = createBrowserRouter([
//   { path: '/', element: <LandingPage /> },
//   { path: '/login', element: <LoginPage /> },
//   { path: '/pre-register', element: <RegisterPage /> },
//   { path: '/verify-registration', element: <VerifyRegistration /> },
//   { path: '/dashboard', element: <DashboardPage /> },
// ]);

// export default function AppRouter() {
//   return <RouterProvider router={router} />;
// }

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import VerifyRegistration from '../pages/VerifyRegistrationPage';
import DashboardPage from '../pages/DashboardPage';
import PrivateRoute from './PrivateRoute';
import RegistrationSuccess from '../pages/RegistrationSuccessPage';

const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/registration', element: <RegisterPage /> },
  { path: '/registration/success', element: <RegistrationSuccess /> },
  { path: '/verify-registration', element: <VerifyRegistration /> },

  // Pivate routes
  {
    element: <PrivateRoute />,
    children: [{ path: '/dashboard', element: <DashboardPage /> }],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
