import * as React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider, PrivateRoute } from './Auth'
import { GameProvider } from './Contexts';
import Layout from './Components/Layout';
import {
    Characters, CharacterDisplay, CharacterForm, Dashboard,
    Home, Items, Login, SignUp, Spells
} from './Pages'
import { ErrorProvider } from './Errors'
import { ApolloProvider } from '@apollo/client';
import { useClient } from './Graphql';
import GameSubRoute from './Contexts/GameSubRoute';
import { Toaster } from './Components/ui';

const App = () => {
    const client = useClient()
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
                                        <Route path="spells" element={<Spells />} />
                                        <Route element={<GameSubRoute />}>
                                        {/* <Route path="characters/:characterId/spell-lists/:id" element={<SpellList />} /> */}
                                            <Route path="characters/create" element={<CharacterForm />} />
                                            <Route path="characters/:id/edit" element={<CharacterForm />} />
                                            <Route path="characters/:id" element={<CharacterDisplay />} />
                                            <Route path="characters" element={<Characters />} />
                                            <Route path="items" element={<Items />} />
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
    )
}

export default App