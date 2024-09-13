import AppWrapper from "@/app-wrapper";
import Login from "@/pages/login";
import Scoreboard from "@/pages/scoreboard";
import AdminPanel from "@/pages/user-panel";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppWrapper element={<Scoreboard />} />,
  },
  {
    path: "/charts",
    element: <AppWrapper element={<>chart</>} />,
  },
  {
    path: "/users",
    element: <AppWrapper element={<AdminPanel />} />,
  },
  {
    path: "/admin",
    element: <Login />,
  },
  {
    path: "*",
    element: <AppWrapper element={<div>404</div>} />,
  },
]);
