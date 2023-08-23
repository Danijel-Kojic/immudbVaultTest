import { lazy } from "react";
import { useRoutes, Outlet } from "react-router-dom";

import Loadable from "components/Loadable";
// project import
import GuestGuard from "utils/route-guard/GuestGuard";
import AuthGuard from "utils/route-guard/AuthGuard";

import { BankProvider } from "contexts/BankContext";

const AuthLogin = Loadable(lazy(() => import("pages/auth/login")));
const Bank = Loadable(lazy(() => import("pages/bank")));
const Error404 = Loadable(lazy(() => import("pages/404")));
// ==============================|| ROUTING RENDER ||============================== //

export default function Routes() {
  return useRoutes([
    {
      path: "/",
      element: (
        <GuestGuard>
          <Outlet />
        </GuestGuard>
      ),
      children: [
        {
          path: "login",
          element: <AuthLogin />,
        },
      ],
    },
    {
      path: "/",
      element: (
        <AuthGuard>
          <Outlet />
        </AuthGuard>
      ),
      children: [
        {
          path: "bank",
          element: (
            <BankProvider>
              <Bank />
            </BankProvider>
          ),
        },
      ],
    },
    {
      path: "*",
      element: <Error404 />,
    },
  ]);
}
