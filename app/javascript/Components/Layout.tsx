import React from "react";
import { ErrorBanner } from "../Errors";
import { useAuth } from "../Auth";
import { Rail, BottomTabs, MobileHeader } from "./Shell";

const Layout = ({ children }: { children: React.ReactNode }) => {
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

  return (
    // Phones: the shell is pinned to the screen's edges (not sized with vh/dvh
    // units, which disagree with mobile browser toolbars) and only <main>
    // scrolls, so the top bar and the bottom tabs never move. Desktop: the
    // page scrolls as usual next to the sticky rail.
    <div className="fixed inset-0 overflow-hidden bg-background lg:static lg:flex lg:min-h-screen lg:overflow-visible">
      <Rail />
      <div className="flex h-full flex-1 flex-col lg:h-auto lg:min-h-screen">
        <MobileHeader />
        <ErrorBanner />
        <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 lg:overflow-visible lg:px-8 lg:py-6">
          {children}
        </main>
        <BottomTabs />
      </div>
    </div>
  );
};

export default Layout;
