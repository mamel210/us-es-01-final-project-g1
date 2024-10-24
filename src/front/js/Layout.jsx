import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import injectContext from "./store/appContext";
// Custom components
// Custom pages / views

import { Login } from "./pages/Login.jsx";
import { Register } from "./pages/Register.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";




// Create your first component
const Layout = () => {
    // The basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";

    return (
        <BrowserRouter basename={basename}>
            <Routes>
                <Route element={<Dashboard />} path="/" />
                <Route element={<Login />} path="/login" />
                <Route element={<Register />} path="/register" />
                <Route element={<h1>Not found!</h1>} path="*" />
            </Routes>
        </BrowserRouter>
    );
};

export default injectContext(Layout);
