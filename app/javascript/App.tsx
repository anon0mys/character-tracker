import * as React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider, PrivateRoute } from './Auth'
import Layout from './Components/Layout';
import { Characters, CharacterDisplay, Dashboard, Home, Login, SignUp } from './Pages'
import { ErrorProvider } from './Errors'

const App = () => {
    return (
        <div className="App">
            <ErrorProvider>
                <AuthProvider>
                    <Layout>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/sign-up" element={<SignUp />} />
                            <Route element={<PrivateRoute />}>
                                <Route path="/dashboard" element={<Dashboard />} />
                                {/* <Route path="spells" element={<Spells />} /> */}
                                {/* <Route path="characters/:characterId/spell-lists/:id" element={<SpellList />} /> */}
                                <Route path="characters/:id" element={<CharacterDisplay />} />
                                <Route path="characters" element={<Characters />} />
                            </Route>
                        </Routes>
                    </Layout>
                </AuthProvider>
            </ErrorProvider>
        </div>
    )
}

export default App