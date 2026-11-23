import React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useBreadcrumbs, useUpLink } from "./breadcrumbs";

interface MobileHeaderProps {
  right?: React.ReactNode;
}

/**
 * 52px top bar for phones. Shows where you are as breadcrumbs: the page's
 * name, the trail above it, and a button up to the parent page. It always
 * stays inside the app (never the browser's back, which can leave the site),
 * and top-level pages have no button.
 */
const MobileHeader = ({ right }: MobileHeaderProps) => {
  const crumbs = useBreadcrumbs();
  const current = crumbs[crumbs.length - 1];
  const ancestors = crumbs.slice(0, -1);
  const parent = ancestors[ancestors.length - 1];
  const goUp = useUpLink(parent?.to ?? "");

  return (
    <header className="z-40 flex h-[52px] flex-shrink-0 items-center gap-1 border-b border-border bg-rail px-[6px] lg:hidden">
      {parent ? (
        <Link
          to={parent.to}
          onClick={goUp}
          aria-label={`Back to ${parent.label}`}
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[10px] text-foreground-2"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
      ) : (
        <span className="w-[10px] flex-shrink-0" />
      )}
      <div className="flex min-w-0 flex-grow flex-col">
        {ancestors.length > 0 && (
          <nav
            aria-label="Breadcrumb"
            className="flex min-w-0 items-center gap-1 overflow-hidden whitespace-nowrap font-mono text-[10.5px] text-muted-foreground"
          >
            {ancestors.map((crumb, index) => (
              <React.Fragment key={crumb.to}>
                {index > 0 && <span aria-hidden="true">›</span>}
                <Link
                  to={crumb.to}
                  className={
                    index === ancestors.length - 1
                      ? "min-w-0 truncate"
                      : "flex-shrink-0"
                  }
                >
                  {crumb.label}
                </Link>
              </React.Fragment>
            ))}
          </nav>
        )}
        <span
          aria-current="page"
          className="truncate font-display text-base font-semibold leading-tight"
        >
          {current.label}
        </span>
      </div>
      {right}
    </header>
  );
};

export default MobileHeader;
