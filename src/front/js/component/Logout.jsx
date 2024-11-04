import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";


export const Logout = () => {
    const { actions } = useContext(Context)
    const navigate = useNavigate()

    const logout = () => {
        actions.logout()
        navigate("/")
    }

    return (
        <div className="logout" onClick={logout}>
            <i className="fa-solid fa-power-off"></i>
        </div>
    )
}
