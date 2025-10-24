import React from 'react'
import { Link } from 'react-router'
import './index.css'

function MovieItem({ eachMovie }) {
  const { id, title, posterPath } = eachMovie
  const movieId = id

  return (
    <Link to={`/movies-app/movies/${movieId}`}>
      <li className="min-w-[140px] xs:min-w-[160px] sm:min-w-[190px] md:min-w-[210px] lg:min-w-[230px] aspect-[2/3] rounded-lg overflow-hidden shadow-lg hover:scale-[1.03] md:hover:scale-105 transition-transform duration-300 cursor-pointer">
        <img
          src={posterPath}
          alt={title}
          className="w-full h-full object-cover"
        />
      </li>
    </Link>
  )
}

export default MovieItem
