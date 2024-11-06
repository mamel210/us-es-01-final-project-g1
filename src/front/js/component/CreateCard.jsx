import React from 'react'
import { Link } from 'react-router-dom'
import "../../styles/createCard.css";
import { useModels } from '../hooks/useModels';


export const CreateCard = ({ model, setInfoMessage }) => {
    const { mapPagesCreateModelsRoutes, mapPagesCreateModelsText } = useModels()
    //--> aqui tenemos que hacerlo dinamico con los modelos
    return (
        <div className="createCard-container">
            <div className="createCard-text">{mapPagesCreateModelsText[model] ?? "default text"} <Link to={mapPagesCreateModelsRoutes[model] ?? "/"} className='createCard-link'>aqui</Link></div>
        </div>
    )
}
