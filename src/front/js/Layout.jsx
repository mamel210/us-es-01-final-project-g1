import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import injectContext from "./store/appContext";
// Custom components
// Custom pages / views

import { Login } from "./pages/Login.jsx";
import { Register } from "./pages/Register.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import { AboutUs } from "./pages/AboutUs.jsx";
import { ContactUs } from "./pages/ContactUs.jsx";
import { Navbar } from "./component/Navbar.jsx";
import { CreatePlanForm } from "./pages/trainingPlans/CreatePlanForm.jsx";
import { UpdatePlanForm } from "./pages/trainingPlans/UpdatePlanForm.jsx";
import { TrainingPlans } from "./pages/trainingPlans/TrainingPlans.jsx";
import { CreateSessions } from "./pages/sessions/CreateSessions.jsx";
import { Sessions } from "./pages/sessions/Sessions.jsx";
import { Exercises } from "./pages/exercises/Exercises.jsx";
import { CreateExercises } from "./pages/exercises/CreateExercises.jsx";


// Create your first component
const Layout = () => {
    // The basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";

    return (
        <BrowserRouter basename={basename}>
            <Navbar />
            <Routes>
                <Route element={<Login />} path="/" />
                <Route element={<Dashboard />} path="/dashboard" />
                <Route element={<Register />} path="/register" />
                <Route element={<AboutUs />} path="/about-us" />
                <Route element={<ContactUs />} path="/contact-us" />
                <Route element={<CreatePlanForm />} path="/create-plan" />
                <Route element={<UpdatePlanForm />} path="/update-plan" />
                <Route element={<TrainingPlans />} path="/training-plan" />
                <Route element={<Sessions />} path="/sessions" />
                <Route element={<CreateSessions />} path="/create-sessions" />
                <Route element={<Exercises />} path="/exercises" />
                <Route element={<CreateExercises />} path="/create-exercises" />
                <Route element={<h1>Not found!</h1>} path="*" />
            </Routes>
        </BrowserRouter>
    );
};

export default injectContext(Layout);
