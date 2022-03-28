import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar'
import Dashboard from './Dashboard';
import AuthProvider from './auth/AuthProvider'
import PrivateOutlet from './auth/PrivateOutlet'
import Login from './Login'
import { Characters, Character } from './characters'
import { SpellList } from './spellLists'
import Spells from './spells/Spells'

const App = () => {
    return (
        <div className="App">
            <AuthProvider>
                <Navbar />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<PrivateOutlet />}>
                        <Route element={<Dashboard />} />
                        <Route path="spells" element={<Spells />} />
                        <Route path="characters/:characterId/spell-lists/:id" element={<SpellList />} />
                        <Route path="characters/:id" element={<Character />} />
                        <Route path="characters" element={<Characters />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </div>
    )
}

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(
        <BrowserRouter>
            <App />
        </BrowserRouter>,
        document.getElementById('app')
    );
})