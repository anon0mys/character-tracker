import * as React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react'
import { MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
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
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/tiptap/styles.css';
import '@mantine/nprogress/styles.css';
import '@mantine/notifications/styles.css';
import GameSubRoute from './Contexts/GameSubRoute';

const theme = createTheme({
    /** Put your mantine theme override here */
});

const App = () => {
    const client = useClient()
    return (
        <div className="App">
            <ApolloProvider client={client}>
                <MantineProvider theme={theme}>
                    <Notifications />
                    <ChakraProvider>
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
                    </ChakraProvider>
                </MantineProvider>
            </ApolloProvider>
        </div>
    )
}

export default App