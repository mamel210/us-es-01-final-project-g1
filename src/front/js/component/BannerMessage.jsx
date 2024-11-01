import React from 'react'

export const BannerMessage = ({evaluation, message, variant="warning"}) => {
  
  if(evaluation) {
    return (
      <div className={`alert alert-${variant}`} role="alert">
      <span>
        {message}
      </span>
    </div>
  )
}
  return null
}
