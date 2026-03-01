import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layout";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <h1>Welcome to the Invoice AI Software</h1>,
      },
      {
        path: "/create-invoice",
        element: <h1>Create your invoice here..</h1>,
      },
      {
        path: "/about",
        element: <h1>About this Invoice AI Software</h1>,
      },
    ],
  },
]);
