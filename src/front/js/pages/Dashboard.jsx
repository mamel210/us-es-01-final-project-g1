import React from 'react'
import { CardInfo } from '../component/CardInfo.jsx'

export const Dashboard = () => {
    return (
        <div className='container mt-2'>
                <h1>DASHBOARD</h1>
            <div className="row" style={{margin: "2rem 0"}}>
                <div className="col-6"><CardInfo /></div>
                <div className="col-6"><CardInfo /></div>
            </div>
            <div className="row" style={{margin: "2rem 0"}}>
                <div className="col-6"><CardInfo /></div>
                <div className="col-6"><CardInfo /></div>
            </div>
        </div>
    )
}
