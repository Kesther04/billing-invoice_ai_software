import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layout";
import RevPilotLandingPage from "../pages/Home";
import { Login } from "../pages/auth/Login";
import { SignUp } from "../pages/auth/SignUp";
import { ForgotPassword } from "../pages/auth/ForgotPassword";
// import { useTheme } from "../shared/themes/ThemeContext";



export const router = createBrowserRouter([
  {
    path: "/",
    element: <RevPilotLandingPage />,
  },
  {
    path: "/auth",
    children: [
      {
        path: "/auth/login",
        element: <Login />,
      },
      {
        path: "/auth/signup",
        element: <SignUp />,
      },
      {
        path: "/auth/forgot-password",
        element: <ForgotPassword/>
      },
    ]
  },

  {
    element: <MainLayout/>,
    children: [
      
      {
        path: "/dashboard",
        element: <h1>Dashboard Overview</h1>,
      },
      {
        path: "/invoices",
        element: <h1>Invoice Management</h1>,
      },
      {
        path: "/clients",
        element: <h1>Client Management</h1>,
      },
      {
        path: "/revenue",
        element: <h1>Revenue Analytics</h1>,
      },
      {
        path: "/create-invoice",
        element: <h1>Create your invoice here..</h1>,
      },
      {
        path: "/settings",
        element: <h1>Settings</h1>,
      }
    ],
  },
]);
