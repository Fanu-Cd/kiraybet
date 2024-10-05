import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/home";
import Session from "../pages/session/session";
import Login from "../pages/session/login";
import { Suspense } from "react";
import Loader from "../components/common/loader";
import ErrorPage from "../pages/common/errorpage";
import UserLayout from "../pages/user/layout";
import UserDashboard from "../pages/user/dashboard";
import MyHouses from "../pages/user/my-houses";
import Rent from "../pages/user/rent";
import OwnerLayout from "../pages/owner/layout";
import OwnerDashboard from "../pages/owner/dashboard";
import { MyHouses as OwnerHouses } from "../pages/owner/my-houses";
import Discover from "../pages/owner/discover";
import NewHouse from "../pages/owner/new-house";
import SignUp from "../pages/session/signup";
import HouseSettings from "../pages/owner/house-settings";
import RentHouse from "../pages/user/rent-house";
import Chats from "../pages/common/chat/chats";
import Chat from "../pages/common/chat/chat";
import SavedHouses from "../pages/user/saved-houses";

export const routes = (userType) => {
  return createBrowserRouter([
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
        {
          path: "my-houses",
          element: (
            <Suspense fallback={<Loader />}>
              <MyHouses />
            </Suspense>
          ),
        },
        {
          path: "saved",
          element: (
            <Suspense fallback={<Loader />}>
              <SavedHouses />
            </Suspense>
          ),
        },
        {
          path: "rent",
          element: (
            <Suspense fallback={<Loader />}>
              <Rent />
            </Suspense>
          ),
        },
        {
          path: "rent/:id",
          element: (
            <Suspense fallback={<Loader />}>
              <RentHouse />
            </Suspense>
          ),
        },
        {
          path: "chats",
          element: (
            <Suspense fallback={<Loader />}>
              <Chats />
            </Suspense>
          ),
          children: [
            {
              path: ":id",
              element: (
                <Suspense fallback={<Loader />}>
                  <Chat />
                </Suspense>
              ),
            },
          ],
        },
        {
          path: "mortgage",
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
      path: "/owner",
      element: (
        <Suspense fallback={<Loader />}>
          {" "}
          <OwnerLayout />
        </Suspense>
      ),
      errorElement: <ErrorPage />,
      children: [
        {
          path: "dashboard",
          element: (
            <Suspense fallback={<Loader />}>
              <OwnerDashboard />
            </Suspense>
          ),
        },
        {
          path: "my-houses",
          element: (
            <Suspense fallback={<Loader />}>
              <OwnerHouses />
            </Suspense>
          ),
        },
        {
          path: "my-houses/new",
          element: (
            <Suspense fallback={<Loader />}>
              <NewHouse />
            </Suspense>
          ),
        },
        {
          path: "my-houses/:id",
          element: (
            <Suspense fallback={<Loader />}>
              <HouseSettings />
            </Suspense>
          ),
        },
        {
          path: "discover",
          element: (
            <Suspense fallback={<Loader />}>
              <Discover />
            </Suspense>
          ),
        },
      ],
    },

    {
      path: "/session",
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
        {
          path: "signup",
          element: (
            <Suspense fallback={<Loader />}>
              <SignUp />
            </Suspense>
          ),
        },
      ],
    },
  ]);
};
