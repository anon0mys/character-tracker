import * as React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, PrivateRoute } from "./Auth";
import { GameProvider } from "./Contexts";
import Layout from "./Components/Layout";
import {
  Characters,
  CharacterDisplay,
  CharacterForm,
  Compendium,
  Dashboard,
  Home,
  Login,
  Settings,
  SignUp,
} from "./Pages";
import { ErrorProvider } from "./Errors";
import { ApolloProvider } from "@apollo/client";
import { useClient } from "./Graphql";
import GameSubRoute from "./Contexts/GameSubRoute";
import { Toaster } from "./Components/ui";

// Placeholder until the Features page ships in Phase 4e.
const FeaturesPlaceholder = () => (
  <div className="rounded-xl border border-border bg-card p-10 text-center text-muted-foreground">
    <p className="font-display text-xl text-foreground">Features</p>
    <p className="mt-2 text-sm">
      Infusions, class features and bio arrive in a later phase.
    </p>
  </div>
);

const App = () => {
  const client = useClient();
  return (
    <div className="App">
      <ApolloProvider client={client}>
        <ErrorProvider>
          <AuthProvider>
            <GameProvider>
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/sign-up" element={<SignUp />} />
                  <Route element={<PrivateRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route
                      path="/compendium"
                      element={<Navigate to="/compendium/spells" replace />}
                    />
                    <Route path="/compendium/:tab" element={<Compendium />} />
                    <Route
                      path="/spells"
                      element={<Navigate to="/compendium/spells" replace />}
                    />
                    <Route
                      path="/items"
                      element={<Navigate to="/compendium/items" replace />}
                    />
                    <Route element={<GameSubRoute />}>
                      <Route
                        path="characters/create"
                        element={<CharacterForm />}
                      />
                      <Route
                        path="characters/:id/edit"
                        element={<CharacterForm />}
                      />
                      <Route
                        path="characters/:id/features"
                        element={<FeaturesPlaceholder />}
                      />
                      <Route
                        path="characters/:id"
                        element={<CharacterDisplay />}
                      />
                      <Route path="characters" element={<Characters />} />
                    </Route>
                  </Route>
                </Routes>
              </Layout>
            </GameProvider>
          </AuthProvider>
        </ErrorProvider>
      </ApolloProvider>
      <Toaster />
    </div>
  );
};

export default App;
