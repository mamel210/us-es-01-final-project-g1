import React, { useContext } from 'react'
import { Context } from '../store/appContext.js'

export const AccountExist = () => {

    const { store } = useContext(Context)
    if (store.errorMessage) {

        return (
            <div className="alert alert-warning" role="alert">
                <span>
                    {store.errorMessage}
                </span>
            </div>
        )
    }
    return null
}
