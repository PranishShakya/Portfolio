import React from 'react'
import BodyTitle from '../SectionTitle'
import AboutPage from '../About'
import Projects from '../Projects'
import Contact from '../Contact'

const Body = () => {
  return (
    <div className="min-h-screen scroll-smooth">
    <div >
      <BodyTitle />
    </div>
    <div>
        <AboutPage />
    </div>
    <div>
        <Projects />
    </div>
    <div>
        <Contact />
    </div>
    </div>
  )
}

export default Body
