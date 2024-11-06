import React, { useContext } from 'react'
import "../../styles/cardInfo.css"
import { FaClock } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useModels } from '../hooks/useModels'
import { Context } from '../store/appContext'


export const CardInfo = ({ title, subtitle, description, durationTime, model, setupItems }) => {
  const { actions } = useContext(Context)

  const items = {
    item_1: setupItems["item_1"],
    item_2: setupItems["item_2"],
    item_3: setupItems["item_3"],
  }
  const { mapViewModels, mapModels, mapRoutesModels, mapImageModels } = useModels()

  const handleViewPlans = () => {
    return actions.setTrainingPlansFilters("")
  }

  return (
    <div className='blog-card'>
      <div className='meta'>
        <div
          className='photo'
          style={{
            backgroundImage:
              `url(${mapImageModels[model]})`
          }}
        ></div>
        <ul className='details'>
          <li className='author'>
            <a href='#'>{mapModels[model]}</a>
          </li>
          <li className='date'>Actualizado, Dec. 24, 2024</li>
          {model === "training_plans" ? (        <li className='tags'>
              <ul>
                <li>
                  <Link to={mapRoutesModels[model]} onClick={(e) => items?.item_1.onClick(e)}>Beginners</Link>
                </li>
                <li>
                  <Link to={mapRoutesModels[model]} onClick={(e) => items?.item_2.onClick(e)}>Medium</Link>
                </li>
                <li>
                  <Link to={mapRoutesModels[model]} onClick={(e) => items?.item_3.onClick(e)}>Expert</Link>
                </li>
              </ul>
            </li>) : (
    null
          )}

        </ul>
      </div>
      <div className='description'>
        <h1>{title}</h1>
        <h2>{subtitle}</h2>
        <div>{description}</div>
        <div className='d-flex gap-1'>

          <span>Duración <FaClock /> :</span>

          <div>{durationTime ?? "12:12:12"}</div>
        </div>

        <p className='read-more'>
          <Link to={mapRoutesModels[model]} onClick={handleViewPlans}>{mapViewModels[model]}</Link>
        </p>
      </div>
    </div>

  )
}
