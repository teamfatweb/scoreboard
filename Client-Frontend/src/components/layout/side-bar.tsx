import { FC, HTMLAttributes } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa6";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { MenuItem, menu } from "@/constants/constants";
import Logo from "@/assets/logo.png";
import { useAuth } from "@/hooks/use-auth";

type Props = HTMLAttributes<HTMLDivElement>;

const SideBar: FC<Props> = ({ className, ...props }) => {
  const navigate = useNavigate();
  const router = useLocation();
  const {logout} = useAuth();
  const handleLogout = () => {
    logout();
  }

  const isSelected = (link: string) => router.pathname === link;

  return (
    <div
      className={cn(
        "max-h-screen min-h-screen h-screen fixed flex flex-col py-6 items-center bg-slate-900 min-w-15 z-100",
        className
      )}
      {...props}
    >
      <div className="flex flex-col flex-grow items-center gap-20">
        <Avatar>
          <AvatarImage src={Logo} alt="@shadcn" />
          <AvatarFallback>F</AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-center gap-3">
          {menu.map((menuItem: MenuItem, key: number) => (
            <span
              className={cn(
                "hover:bg-gray-500 transition-all transition-duration-500 border-l-2 border-transparent",
                isSelected(menuItem.link) && "border-orange-500"
              )}
              key={key}
            >
              <Button
                variant="link"
                color="white"
                onClick={() => navigate(menuItem.link)}
              >
                {menuItem.icon({
                  className: "w-6 h-6",
                  color: isSelected(menuItem.link) ? "#f97316" : "white",
                })}
              </Button>
            </span>
          ))}
        </div>
      </div>

      <span
        className={cn(
          "hover:bg-gray-700 transition-all transition-duration-500",
          router.pathname === "/settings" &&
            "border-l-2 border-orange-500 bg-gray-600"
        )}
      >
        <Button
          variant="link"
          color="white"
          onClick={handleLogout}
        >
          <FaUser className="w-6 h-6" color="white" />
        </Button>
      </span>
    </div>
  );
};

export default SideBar;
