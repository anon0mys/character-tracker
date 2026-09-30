import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardDescription } from "../ui";
import { Trash2 } from "lucide-react";
import { useGame } from "../../Contexts";
import { IGameType } from "../../Api";
import { ConfirmModal } from "../Shared";
import { useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils";

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  pending: { label: "Prepping", cls: "bg-arcane-soft text-arcane-ink" },
  active: { label: "Active", cls: "bg-vitality-soft text-vitality-ink" },
  finished: { label: "Wrapped", cls: "bg-secondary text-foreground-2" },
};

interface GameCardProps {
  game: IGameType;
  deleteGame: (game: IGameType) => Promise<any>;
}

const GameCard = ({ game, deleteGame }: GameCardProps) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { setCurrentGame } = useGame();

  const openDeleteModal = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setOpen(true);
  };

  const setGame = (event: React.MouseEvent) => {
    event.preventDefault();
    console.log("setting game", game);
    setCurrentGame(game);
    navigate("/characters");
  };

  const submit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    deleteGame(game).then(() => setOpen(false));
  };

  return (
    <Card
      key={game.id}
      onClick={setGame}
      className="cursor-pointer hover:border-border transition-all duration-300 hover: group overflow-hidden"
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-primary transition-colors group-hover:text-primary">
              {game.name}
            </h3>
            {game.status && STATUS_LABEL[game.status] && (
              <span
                className={cn(
                  "rounded-full px-2 py-[2px] font-mono text-[9px] uppercase tracking-[0.08em]",
                  STATUS_LABEL[game.status].cls,
                )}
              >
                {STATUS_LABEL[game.status].label}
              </span>
            )}
          </div>
          <button
            onClick={openDeleteModal}
            className="text-muted-foreground hover:text-destructive p-1 rounded-md hover:bg-destructive/10 transition-colors z-10"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {game.start_date && (
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-muted-foreground">
              Start Date:
            </span>
            <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
              {game.start_date}
            </span>
          </div>
        )}
        {game.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {game.description}
          </p>
        )}
      </CardContent>
      <ConfirmModal
        copy={`Delete ${game.name}`}
        open={open}
        setOpen={setOpen}
        onSubmit={submit}
      >
        <p>Are you sure you want to delete {game.name}</p>
      </ConfirmModal>
    </Card>
  );
};

export default GameCard;
