import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layout";
import RevPilotLandingPage from "../pages/Home";
import { ForgotPassword, Login, ResetPassword, SignUp } from "../modules/auth";
import { CreateInvoicePage, InvoiceDetailsPage, InvoiceListPage } from "../modules/billing";
import { DashboardPage } from "../modules/revenue-intelligence";
import { AutomationSettingsPage } from "../modules/revenue-automation";
import { ClientsPage } from "../modules/clients";

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
        element: <ForgotPassword />,
      },
      {
        path: "/auth/reset-password",
        element: <ResetPassword />,
      }
    ],
  },

  {
    element: <MainLayout />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
      {
        path: "/billing/invoices",
        element: <InvoiceListPage />,
      },
      {
        path: "/billing/invoices/:id",
        element: <InvoiceDetailsPage />,
      },
      {
        path: "/clients",
        element: <ClientsPage />,
      },
      {
        path: "/revenue",
        element: <AutomationSettingsPage />,
      },
      {
        path: "/billing/create",
        element: <CreateInvoicePage />,
      },
      {
        path: "/settings",
        element: <h1>Settings</h1>,
      },
    ],
  },
]);
