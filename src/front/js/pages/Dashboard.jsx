import React from 'react'
import { CardInfo } from '../component/CardInfo.jsx'
import "../../styles/dashboard.css"
import { CardIndicator } from '../component/CardIndicator.jsx'

export const Dashboard = () => {
  return (
    <div className='grid-conxtainer'>






      <main className='maixn'>
        {/* <div className='main-header'>
          <div className='main-header__heading'>Hello User, stats</div>
          <div className='main-header__updates'>Badge indicadores, quizas hardcoding</div>
        </div> */}

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
          <div className='cardx'><CardInfo title={"titulo modelo1"} subtitle={"algun mensaje motivador1"} description={"algun mensaje"} /></div>
          <div className='cardx'><CardInfo title={"titulo modelo2"} subtitle={"algun mensaje motivador2"} description={"algun mensaje"} /></div>
          <div className='cardx'><CardInfo title={"titulo modelo3"} subtitle={"algun mensaje motivador3"} description={"algun mensaje"} /></div>
          <div className='cardx'><CardInfo title={"titulo modelo3"} subtitle={"algun mensaje motivador4"} description={"algun mensaje"} /></div>
        </div>
      </main>


    </div>
  )
}
