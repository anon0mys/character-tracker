import React from "react";
import { NavLink, Link } from "react-router-dom";
import { Edit } from "lucide-react";
import { ICharacterType, Client } from "../../Api";
import { useAuth } from "../../Auth";
import { useError } from "../../Errors";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui";
import { cn } from "../../lib/utils";
import initials from "../Shell/initials";

interface IdentityHeaderProps {
  character: ICharacterType;
  onRested: (character: ICharacterType) => void;
}

const IdentityHeader = ({ character, onRested }: IdentityHeaderProps) => {
  const auth = useAuth();
  const client = Client();
  const errors = useError();
  const id = character.id;

  const meta = [
    `${character.archetype} ${character.level}`,
    character.race,
    character.background,
    character.alignment,
    character.age ? `Age ${character.age}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const rest = (type: "short" | "long") => {
    if (!id) return;
    client
      .post({
        path: `/characters/${id}/rest`,
        payload: { type },
        token: auth.getToken(),
      })
      .then((response) => onRested(response.data))
      .catch((err) => errors.setError(err));
  };

  const segment =
    "flex min-h-[38px] items-center rounded-lg px-[14px] text-[13px] no-underline";

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-[14px]">
      <span className="flex h-[50px] w-[50px] flex-shrink-0 items-center justify-center rounded-full bg-proficiency font-mono text-[17px] text-primary-foreground ring-4 ring-background">
        {initials(character.name || "?")}
      </span>
      <div className="flex flex-col gap-[2px]">
        <h1 className="font-display text-[30px] font-semibold leading-tight">
          {character.name}
        </h1>
        <div className="text-[12.5px] text-foreground-2">{meta}</div>
      </div>

      <div className="flex flex-wrap items-center gap-[9px] lg:ml-auto">
        <div className="flex gap-[3px] rounded-[10px] border border-border bg-rail p-[3px]">
          <NavLink
            to={`/characters/${id}`}
            end
            className={({ isActive }) =>
              cn(
                segment,
                isActive
                  ? "bg-card font-semibold text-foreground"
                  : "text-foreground-2",
              )
            }
          >
            Sheet
          </NavLink>
          <NavLink
            to={`/characters/${id}/features`}
            className={({ isActive }) =>
              cn(
                segment,
                isActive
                  ? "bg-card font-semibold text-foreground"
                  : "text-foreground-2",
              )
            }
          >
            Features
          </NavLink>
          <NavLink
            to={`/characters/${id}/notes`}
            className={({ isActive }) =>
              cn(
                segment,
                isActive
                  ? "bg-card font-semibold text-foreground"
                  : "text-foreground-2",
              )
            }
          >
            Notes
          </NavLink>
        </div>

        {id && (
          <Link
            to={`/characters/${id}/edit`}
            className="flex min-h-[44px] items-center gap-2 rounded-[10px] border border-border-strong bg-card px-[15px] text-sm font-medium no-underline"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Link>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="min-h-[44px] rounded-[10px] border border-border-strong bg-secondary px-[15px] text-sm font-medium"
            >
              Rest
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => rest("short")}>
              Short rest
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => rest("long")}>
              Long rest
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default IdentityHeader;
