import React, { Children } from 'react'
import ContentLoader from 'react-content-loader';


export const Loader = () => {

  return (
    <ContentLoader
      viewBox='0 0 1000 310'
      backgroundColor={"gray"}
      foregroundColor={"white"}
      style={{ width: '100%', height: 'auto', margin: "0 0 1rem 0" }}
    >
      <rect x='0' y='0' rx='3' ry='3' width='100%' height='310' />
    </ContentLoader>

  )
}


export const SkeletonTable = () => {
  const height = 24;
  const count = new Array(8).fill();
  return (
    <>
      {Children.toArray(count.map(() => (
        <ContentLoader
          width={'100%'}
          height={'47px'}
          viewBox='0 0 1000 30'
          backgroundColor={"gray"}
          foregroundColor={"white"}
          style={{ width: '100%' }}
        >
          <rect x='0' y='0' rx='3' ry='3' width='200' height={height} />
          <rect x='275' y='0' rx='3' ry='3' width='200' height={height} />
          <rect x='550' y='0' rx='3' ry='3' width='200' height={height} />
          <rect x='800' y='0' rx='3' ry='3' width='200' height={height} />
        </ContentLoader>
      )))}
    </>
  )
}