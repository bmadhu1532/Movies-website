import React from 'react'

function Loading(props) {
    const {height} = props
  return (
    <div className={`flex items-center justify-center w-full bg-black ${height}`}>
      <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-gray-300/60 border-t-red-500 rounded-full animate-spin"></div>
    </div>
  )
}

export default Loading;
