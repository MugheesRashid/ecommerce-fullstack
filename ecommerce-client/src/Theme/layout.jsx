import React from 'react'

function layout({children}) {
  return (
    <div className="px-0 md:px-10">
      {children}
    </div>
  )
}

export default layout