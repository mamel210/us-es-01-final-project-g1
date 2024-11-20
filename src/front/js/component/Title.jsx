import React from 'react'
import { Card } from 'react-bootstrap'

export const Title = ({ title, children }) => {
    return (
        <div className='common-title'>
            <>{title}</>
            <>{children}</>
        </div>
    )
}
