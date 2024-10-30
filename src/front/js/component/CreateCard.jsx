import React from 'react'
import { Link } from 'react-router-dom'
import "../../styles/createCard.css";

export const CreateCard = () => {
    return (
        <div>
            <div className="createCard-container">
                <div className="createCard-text">Crea tu Primer Plan de Ejercicio <Link to={"/create-plan"} className='createCard-link'>aqui</Link></div>
            </div>
        </div>
    )
}
