import React from 'react'
import "../../styles/cardInfo.css"
import { FaClock } from 'react-icons/fa'


export const CardInfo = ({ title, subtitle, description, durationTime }) => {
  return (
    <div className='blog-card'>
      <div className='meta'>
        <div
          className='photo'
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1591227174835-d3705c881c90?w=294&dpr=1&h=294&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXRodW1ibmFpbHx8ODMyNTE3MHx8ZW58MHx8fHx8)'
          }}
        ></div>
        <ul className='details'>
          <li className='author'>
            <a href='#'>Planes</a>
          </li>
          <li className='date'>Actualizado, Dec. 24, 2024</li>
          <li className='tags'>
            <ul>
              <li>
                <a href='#'>Beginners</a>
              </li>
              <li>
                <a href='#'>Medium</a>
              </li>
              <li>
                <a href='#'>Expert</a>
              </li>
              {/* <li>
              <a href='#'>High Impact</a>
            </li> */}
            </ul>
          </li>
        </ul>
      </div>
      <div className='description'>
        <h1>{title}</h1>
        <h2>{subtitle}</h2>
        {/* descripcion del plan */}
        {/* items relaciones */}
        {/* tiempo aproximado de duracion */}
        <div>{description}</div>
        <div className='d-flex gap-1'>
          
          <span>Duración <FaClock /> :</span>
          
          <div>{durationTime ?? "12:12:12"}</div>
        </div>

        <p className='read-more'>
          <a href='#'>Ver planes</a>
        </p>
      </div>
    </div>

  )
}
