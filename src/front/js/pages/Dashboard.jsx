import React from 'react'
import { CardInfo } from '../component/CardInfo.jsx'
import "../../styles/dashboard.css"
import { CardIndicator } from '../component/CardIndicator.jsx'

export const Dashboard = () => {
  return (
    <div className='grid-container'>
      <div className='menu-icon'>
        {/* <FaBars className='header__menu' size={'1rem'} /> */}
        <i className='fas fa-bars header__menu'></i>
      </div>

      <header className='header'>
        <div className='header__search'>Search... o algo</div>
        <div className='header__avatar'>Profile Logout</div>
      </header>

      <aside className='sidenav'>
        <div className='sidenav__close-icon'>
          <i className='fas fa-times sidenav__brand-close'></i>
        </div>
        <ul className='sidenav__list'>
          <li className='sidenav__list-item'>Modelo 1</li>
          <li className='sidenav__list-item'>Modelo 2</li>
          <li className='sidenav__list-item'>Modelo 3</li>
          <li className='sidenav__list-item'>Modelo 4</li>
          <li className='sidenav__list-item'>Modelo 5</li>
        </ul>
      </aside>

      <main className='main'>
        <div className='main-header'>
          <div className='main-header__heading'>Hello User, stats</div>
          <div className='main-header__updates'>Badge indicadores, quizas hardcoding</div>
        </div>

        <div className='main-overview'>
          <div className='overview-cardIndicator'>
            <CardIndicator value={"mariana"} description={"hueck"} section={"planCount"} />
          </div>
          <div className='overview-cardIndicator'>
            <CardIndicator value={"mariana"} description={"hueck"} section={"membersCount"} />
          </div>
          <div className='overview-cardIndicator'>
            <CardIndicator value={"mariana"} description={"hueck"} section={"timeCount"} />
          </div>
          <div className='overview-cardIndicator'>
            <CardIndicator value={"mariana"} description={"hueck"} section={"percentageGoal"} />
          </div>
        </div>

        <div className='main-cards'>
          <div className='card'>Card Resumen Modelo 1</div>
          <div className='card'>Card Resumen Modelo 2</div>
          <div className='card'>Card Resumen Modelo 3</div>
          <div className='card'>Card Resumen Modelo 4</div>
        </div>
      </main>

      <footer className='footer'>
        <div className='footer__copyright'>&copy; 2018 Valero Arts</div>
        <div className='footer__signature'>Made with love by pure genius</div>
      </footer>
    </div>
  )
}
