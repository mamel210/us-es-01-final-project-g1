import React from 'react'

export const CardInfo = () => {
  return (
    <div className=' shadow-lg cardContainer'>
      <div className='cardBody-container'>
        <div className='cardBody-image'>
          <img className='cardBody-image-img' src='https://images.unsplash.com/photo-1591227174835-d3705c881c90?w=294&dpr=1&h=294&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXRodW1ibmFpbHx8ODMyNTE3MHx8ZW58MHx8fHx8' alt={"mamel"} />
        </div>

        <div className='cardBody-content'>
          <div className='cardHeader-title'>
            <>"plan de ejercicios"</>
            <div>HeaderIndicators</div>
          </div>
          <div className='timeDurationContent'>
            Duración:
            <i class="fas fa-clock"></i>
            <div>12:12:12</div>
          </div>
          <div className='cardBody-text'><p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium natus consectetur ab blanditiis nostrum
            nesciunt temporibus maxime quam?
          </p>
            <ul>
              <li>item1</li>
              <li>item3</li>
            </ul></div>
        </div>
      </div>
    </div>

  )
}
