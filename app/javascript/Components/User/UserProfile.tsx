import React from "react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../ui";
import { useAuth } from "../../Auth/AuthProvider";
import initials from "../Shell/initials";

const UserProfile = ({ collapsed = false }: { collapsed?: boolean }) => {
  const auth = useAuth();
  const navigate = useNavigate();
  const signout = (event: React.MouseEvent) => {
    event.preventDefault();
    auth.signout(() => {
      navigate("/");
    });
  };

  const email = auth.user?.email ?? "";
  const avatar = email ? initials(email.split("@")[0]) : "U";

  const avatarBadge = (
    <span className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-arcane font-mono text-[13px] text-primary-foreground">
      {avatar}
    </span>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex flex-grow items-center gap-[10px] rounded-md text-left focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Account menu"
        >
          {avatarBadge}
          {!collapsed && (
            <span className="flex-grow truncate text-[13px] font-medium text-foreground">
              {email}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel className="truncate font-normal text-muted-foreground">
          {email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={signout}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfile;
