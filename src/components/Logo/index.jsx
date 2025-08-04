import React from 'react'
import { Link } from 'react-router'

const Logo = () => {
  return (
    <Link to={'/'} className="flex w-54 h-25 fixed">
      <img src='Logop.png' alt='logo' />
    </Link>
  )
}

export default Logo
