import * as React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react'
import { AuthProvider, PrivateRoute } from './Auth'
import Layout from './Components/Layout';
import { Characters, CharacterDisplay, Dashboard, Home, Items, Login, SignUp, Spells } from './Pages'
import { ErrorProvider } from './Errors'
import { ApolloProvider } from '@apollo/client';
import { useClient } from './Graphql';

const App = () => {
    const client = useClient()
    return (
        <div className="App">
            <ApolloProvider client={client}>
                <ChakraProvider>
                    <ErrorProvider>
                        <AuthProvider>
                            <Layout>
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/sign-up" element={<SignUp />} />
                                    <Route element={<PrivateRoute />}>
                                        <Route path="/dashboard" element={<Dashboard />} />
                                        <Route path="spells" element={<Spells />} />
                                        {/* <Route path="characters/:characterId/spell-lists/:id" element={<SpellList />} /> */}
                                        <Route path="characters/:id" element={<CharacterDisplay />} />
                                        <Route path="characters" element={<Characters />} />
                                        <Route path="items" element={<Items />} />
                                    </Route>
                                </Routes>
                            </Layout>
                        </AuthProvider>
                    </ErrorProvider>
                </ChakraProvider>
            </ApolloProvider>
        </div>
    )
}

export default App