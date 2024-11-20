import React, { useState } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import injectContext from "./store/appContext";
// Custom components
// Custom pages / views

import { Login } from "./pages/Login.jsx";
import { Register } from "./pages/Register.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import { AboutUs } from "./pages/aboutus/AboutUs.jsx";
import { CustomNavbar } from "./component/CustomNavbar.jsx";
import { CreatePlanForm } from "./pages/trainingPlans/CreatePlanForm.jsx";
import { UpdatePlanForm } from "./pages/trainingPlans/UpdatePlanForm.jsx";
import { TrainingPlans } from "./pages/trainingPlans/TrainingPlans.jsx";
import { CreateSessions } from "./pages/sessions/CreateSessions.jsx";
import { Sessions } from "./pages/sessions/Sessions.jsx";
import { Exercises } from "./pages/exercises/Exercises.jsx";
import { Muscles } from "./pages/muscles/Muscles.jsx";
import { HowItWorks } from "./pages/howitworks/HowItWorks.jsx";
import { SessionExpiredModal } from "./component/SessionExpiredModal.jsx";
import { ProtectedRoute } from "./component/ProtectedRoute.jsx";


// Create your first component
const Layout = () => {
    // The basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";

    return (
        <BrowserRouter basename={basename}>
            <CustomNavbar />
            <SessionExpiredModal />
            <Routes>
                {/* Rutas públicas */}
                <Route element={<Login />} path="/" />
                <Route element={<Register />} path="/register" />
                <Route element={<AboutUs />} path="/about-us" />

                {/* Rutas protegidas */}
                <Route
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                    path="/dashboard"
                />
                <Route
                    element={
                        <ProtectedRoute>
                            <TrainingPlans />
                        </ProtectedRoute>
                    }
                    path="/training-plan"
                />
                <Route
                    element={
                        <ProtectedRoute>
                            <Sessions />
                        </ProtectedRoute>
                    }
                    path="/sessions"
                />
                <Route
                    element={
                        <ProtectedRoute>
                            <CreateSessions />
                        </ProtectedRoute>
                    }
                    path="/create-sessions"
                />
                <Route
                    element={
                        <ProtectedRoute>
                            <Exercises />
                        </ProtectedRoute>
                    }
                    path="/exercises"
                />
                <Route
                    element={
                        <ProtectedRoute>
                            <Muscles />
                        </ProtectedRoute>
                    }
                    path="/muscles"
                />
                <Route
                    element={
                        <ProtectedRoute>
                            <CreatePlanForm />
                        </ProtectedRoute>
                    }
                    path="/create-plan"
                />
                <Route
                    element={
                        <ProtectedRoute>
                            <UpdatePlanForm />
                        </ProtectedRoute>
                    }
                    path="/update-plan"
                />
                <Route
                    element={
                        <ProtectedRoute>
                            <HowItWorks />
                        </ProtectedRoute>
                    }
                    path="/how-it-works"
                />
                <Route element={<h1>Not found!</h1>} path="*" />
            </Routes>
        </BrowserRouter>
    );
};

export default injectContext(Layout);
