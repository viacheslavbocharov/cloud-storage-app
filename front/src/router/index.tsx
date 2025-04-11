import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import VerifyRegistration from "../pages/VerifyRegistration";

const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/sign-in", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/verify-registration", element: <VerifyRegistration /> },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
