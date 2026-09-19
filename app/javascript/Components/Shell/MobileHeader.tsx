import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

interface MobileHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: React.ReactNode;
}

// 52px top bar for phones: optional back, title/subtitle, optional actions.
const MobileHeader = ({
  title,
  subtitle,
  onBack,
  right,
}: MobileHeaderProps) => {
  const navigate = useNavigate();
  const back = onBack ?? (() => navigate(-1));

  return (
    <header className="flex h-[52px] flex-shrink-0 items-center gap-1 border-b border-border bg-rail px-[6px] lg:hidden">
      <button
        type="button"
        aria-label="Back"
        onClick={back}
        className="flex h-11 w-11 items-center justify-center rounded-[10px] text-foreground-2"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <div className="flex min-w-0 flex-grow flex-col">
        <span className="truncate font-display text-base font-semibold leading-tight">
          {title}
        </span>
        {subtitle && (
          <span className="truncate font-mono text-[9.5px] text-muted-foreground">
            {subtitle}
          </span>
        )}
      </div>
      {right}
    </header>
  );
};

export default MobileHeader;
