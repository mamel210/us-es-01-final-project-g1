import React, { useContext } from 'react'
import { Context } from '../store/appContext';


export const RegisterMessage = () => {
    const { store } = useContext(Context);
    if (store.accountExist !== "notExist") {
        return null
    }
    return (
        <div className="alert alert-warning" role="alert">
            <span>
                Tu cuenta no existe, por favor Registrate
            </span>
        </div>
    )
}
