import { FC, HTMLAttributes } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa"; // More common logout icon
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { MenuItem, menu } from "@/constants/constants";
import Logo from "@/assets/logo.png";
import { useAuth } from "@/hooks/use-auth";
import Swal from "sweetalert2"; // Import SweetAlert2

type Props = HTMLAttributes<HTMLDivElement>;

const SideBar: FC<Props> = ({ className, ...props }) => {
  const navigate = useNavigate();
  const router = useLocation();
  const { logout } = useAuth();

  // Modify handleLogout to use SweetAlert2 confirmation
  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#008000", // Orange color for confirmation
      cancelButtonColor: "#d33", // Red color for cancel
      confirmButtonText: "Yes, log me out!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        logout(); // Proceed with logout if confirmed
        Swal.fire("Logged out!", "You have successfully logged out.", "success");
      }
    });
  };

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
          <AvatarImage src={Logo} alt="Logo" />
          <AvatarFallback>F</AvatarFallback>
        </Avatar>

        <div className="flex flex-col items-center gap-3">
          {menu.map((menuItem: MenuItem) => {
            const isActive = isSelected(menuItem.link);
            return (
              <span
                key={menuItem.link}
                className={cn(
                  "hover:bg-gray-500 transition-all transition-duration-500 border-l-2 border-transparent",
                  isActive && "border-orange-500"
                )}
              >
                <Button
                  variant="link"
                  color="white"
                  onClick={() => navigate(menuItem.link)}
                >
                  {menuItem.icon({
                    className: "w-6 h-6",
                    color: isActive ? "#f97316" : "white",
                  })}
                </Button>
              </span>
            );
          })}
        </div>
      </div>

      <div className="mt-auto">
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
            onClick={handleLogout} // Trigger SweetAlert confirmation
          >
            <FaSignOutAlt className="w-6 h-6" color="white" />
          </Button>
        </span>
      </div>
    </div>
  );
};

export default SideBar;
