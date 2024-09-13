import { ReactNode } from "react";
import SideBar from "./components/layout/side-bar";
import "./app.css";
import { useAuth } from "./hooks/use-auth";

const AppWrapper = ({ element }: { element: ReactNode }) => {
  const { jwt } = useAuth();

  return (
    <div className="flex gap-0 row-revert">
      <div className="flex-grow">{element}</div>
      {jwt && <SideBar className="min-w-[58px]" />}
    </div>
  );
};

export default AppWrapper;
