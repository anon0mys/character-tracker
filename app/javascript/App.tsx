import * as React from "react";
import { Routes, Route } from 'react-router-dom';
import { AuthProvider, Login, SignUp, PrivateRoute } from './Auth'
import { Dashboard, Layout } from './Layouts'
import { ErrorProvider } from './Errors'

const App = () => {
    return (
        <div className="App">
            <ErrorProvider>
                <AuthProvider>
                    <Layout>
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/sign-up" element={<SignUp />} />
                            <Route path="/" element={<PrivateRoute />}>
                                <Route index element={<Dashboard />} />
                                {/* <Route path="spells" element={<Spells />} /> */}
                                {/* <Route path="characters/:characterId/spell-lists/:id" element={<SpellList />} /> */}
                                {/* <Route path="characters/:id" element={<Character />} /> */}
                                {/* <Route path="characters" element={<Characters />} /> */}
                            </Route>
                        </Routes>
                    </Layout>
                </AuthProvider>
            </ErrorProvider>
        </div>
    )
}

export default App