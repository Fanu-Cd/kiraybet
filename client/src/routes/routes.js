import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/home";
import Session from "../pages/session/session";
import Login from "../pages/session/login";
import { Suspense } from "react";
import Loader from "../components/common/loader";
import ErrorPage from "../pages/common/errorpage";
import UserLayout from "../pages/user/layout";
import UserDashboard from "../pages/user/dashboard";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<Loader />}>
        {" "}
        <Home />
      </Suspense>
    ),
    errorElement: <ErrorPage />,
    // loader
  },

  {
    path: "/me",
    element: (
      <Suspense fallback={<Loader />}>
        {" "}
        <UserLayout />
      </Suspense>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: "dashboard",
        element: (
          <Suspense fallback={<Loader />}>
            <UserDashboard />
          </Suspense>
        ),
      },
    ],
    // loader
  },

  {
    path: "session",
    element: <Session />,
    children: [
      {
        path: "login",
        element: (
          <Suspense fallback={<Loader />}>
            <Login />
          </Suspense>
        ),
      },
    ],
  },
]);
