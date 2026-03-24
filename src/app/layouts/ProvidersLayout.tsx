import { Outlet } from "react-router";

/** Thin layout shim — all providers now live above RouterProvider in App.tsx */
export function ProvidersLayout() {
  return <Outlet />;
}