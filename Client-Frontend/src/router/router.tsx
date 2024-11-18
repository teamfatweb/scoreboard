import AppWrapper from "@/app-wrapper";
import Login from "@/pages/login";
import Scoreboard from "@/pages/scoreboard";
import AdminPanel from "@/pages/user-panel";
import ChampionBoard from "@/pages/championsboard";
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
    path: "/champions-board",
    element: <AppWrapper element={<ChampionBoard />} />, // New Champion Board route
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
