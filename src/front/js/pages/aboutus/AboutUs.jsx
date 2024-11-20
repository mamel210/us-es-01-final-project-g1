import React, { useState } from 'react'
import { Image, Placeholder, Spinner } from 'react-bootstrap'
import "./aboutus.css"
import m_avatar from "../../../../static/images/avatars/m_avatar.jpg"
import ja_avatar from "../../../../static/images/avatars/ja_avatar.jpg"
import jm_avatar from "../../../../static/images/avatars/jm_avatar.jpg"

export const AboutUs = () => {
  const [isMarianaLoaded, setIsMarianaLoaded] = useState(false);
  const [isJoseManuelLoaded, setIsJoseManuelLoaded] = useState(false);
  const [isJoseAlejandroLoaded, setIsJoseAlejandroLoaded] = useState(false);
  return (
    <div style={{ color: "white", padding: "2rem", maxWidth: "950px", margin: "auto" }}>
      <h1>About Us</h1>
      <section>
        <p>
          At PowerPulse, our journey started with a vision to empower individuals and communities through fitness and well-being.
          Our goal is to make training accessible, effective, and enjoyable, creating a platform where everyone, regardless of their
          fitness level, can find the tools they need to reach their personal goals. PowerPulse is more than just an app; it's a step toward
          a healthier, stronger, and more connected community. Together, we believe in the power of consistent, focused training, and we're
          here to support each user on their unique journey.
        </p>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>Meet Our Team</h2>
        <div style={{ marginTop: "1.5rem" }}>
          <div className='d-flex gap-3'>
            {!isMarianaLoaded && (
              <div className="image-skeleton" />
            )}
            <Image
              roundedCircle
              src={m_avatar}
              alt="Mariana Avatar"
              className={`img-fluid avatar-images ${isMarianaLoaded ? '' : 'd-none'}`}
              onLoad={() => setIsMarianaLoaded(true)}
            />
            <div>
              <h3>Mariana</h3>
              <p>
                Mariana is the heart of our design team, dedicated to creating intuitive and inspiring user experiences. With a keen eye for detail
                and a deep understanding of user behavior, she has crafted PowerPulse to be visually appealing and highly functional. Her passion for
                fitness and design has shaped PowerPulse into a platform that feels welcoming and engaging from the moment you start using it.
              </p>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "1.5rem" }}>
          <div className='d-flex gap-3 flex-row-reverse'>
            {!isJoseManuelLoaded && (
              <div className="image-skeleton" />
            )}
            <Image
              roundedCircle
              src={jm_avatar}
              alt="Jose Manuel Avatar"
              className={`img-fluid avatar-images ${isJoseManuelLoaded ? '' : 'd-none'}`}
              onLoad={() => setIsJoseManuelLoaded(true)}
            />
            <div>
              <h3 className='text-end'>Jose Manuel</h3>
              <p className='text-end'>
                Jose Manuel is the technical mastermind behind PowerPulse, with extensive experience in software development and a commitment to innovation.
                He believes that technology can simplify and enhance our lives, especially in the realm of fitness and health. Jose Manuel's expertise has
                transformed PowerPulse into a reliable and scalable platform, ensuring every feature performs seamlessly for our community.
              </p>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "1.5rem" }}>
          <div className='d-flex gap-3'>
            {!isJoseAlejandroLoaded && (
              <div className="image-skeleton" />
            )}-
            <Image
              roundedCircle
              src={ja_avatar}
              alt="Jose Alejandro Avatar"
              className={`img-fluid avatar-images ${isJoseAlejandroLoaded ? '' : 'd-none'}`}
              onLoad={() => setIsJoseAlejandroLoaded(true)}
            />
            <div>
              <h3>Jose Alejandro</h3>
              <p>
                Jose Alejandro is a passionate developer and fitness enthusiast, combining his love for coding with his dedication to a healthy lifestyle.
                His contribution to PowerPulse has been instrumental in building the features that make training efficient and enjoyable. Jose Alejandro is
                always exploring new ways to bring value to our users, ensuring PowerPulse remains at the forefront of fitness technology.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
