import React from "react";
import { ErrorBanner } from "../Errors";
import { useGame } from "../Contexts";
import { useAuth } from "../Auth";
import { Rail, BottomTabs, MobileHeader } from "./Shell";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { game } = useGame();
  const auth = useAuth();

  // Signed-out visitors (Home / Login / Sign-up) get no shell chrome.
  if (!auth.user) {
    return (
      <>
        <ErrorBanner />
        <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-6">
          {children}
        </main>
      </>
    );
  }

  const title = game?.name ?? "Dungeon Tracker";

  return (
    <div className="min-h-screen bg-background lg:flex">
      <Rail />
      <div className="flex min-h-screen flex-1 flex-col">
        <MobileHeader title={title} />
        <ErrorBanner />
        <main className="flex-1 px-4 py-4 lg:px-8 lg:py-6">{children}</main>
        <BottomTabs />
      </div>
    </div>
  );
};

export default Layout;
