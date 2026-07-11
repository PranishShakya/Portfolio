import React from 'react'
import { Link } from 'react-router'

const Logo = () => {
  return (
    <Link to='/' className="flex items-center h-20 w-auto">
      <img src='Logop.png' alt='logo' className="h-full object-contain max-h-16" />
    </Link>
  )
}

export default Logo

