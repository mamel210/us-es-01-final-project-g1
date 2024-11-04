import React from 'react'
import ContentLoader from 'react-content-loader';


export const Loader = () => {
  return (
    <ContentLoader
      viewBox='0 0 1000 900'
      backgroundColor={"gray"}
      foregroundColor={"white"}
      style={{ width: '100%', height: 'auto' }}
    >
      <rect x='0' y='0' rx='3' ry='3' width='100%' height='260'  />
    </ContentLoader>

  )
}
