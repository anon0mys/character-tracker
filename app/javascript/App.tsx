import * as React from "react";
import { Routes, Route } from 'react-router-dom';
import { AuthProvider, Login, SignUp, PrivateRoute } from './Auth'
import { Characters, Dashboard, Home, Layout } from './Layouts'
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
                                {/* <Route path="characters/:id" element={<Character />} /> */}
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