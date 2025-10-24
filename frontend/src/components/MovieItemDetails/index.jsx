import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import MovieItem from '../MovieItem'
import Loading from '../Loading'
import { FaGoogle, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import Cookies from 'js-cookie'

function MovieItemDetails() {
  const { movieId } = useParams()
  const [uniqueMovie, setUniqueMovie] = useState({})
  const [genres, setGenres] = useState([])
  const [SpokenLanguages, setSpokenLanguages] = useState([])
  const [SimilarMovies, setSimilarMovies] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const jwtToken = Cookies.get("jwt_token")

  useEffect(() => {
    const eachMovieDetails = async () => {
      setIsLoading(true)
      const apiUrl = `https://projectmovies-1.onrender.com/movies-app/movies/${movieId}`
      // const apiUrl = `https://apis.ccbp.in/movies-app/movies/${movieId}`
      const options = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }

      const response = await fetch(apiUrl, options)
      if (response.ok === true) {
        const data = await response.json()
        console.log(data)
        const movieDetails = data.movie_details
        const formattedMovieDetails = {
          adult: movieDetails.adult,
          backdropPath: movieDetails.backdrop_path,
          budget: movieDetails.budget,
          id: movieDetails.id,
          overview: movieDetails.overview,
          posterPath: movieDetails.poster_path,
          releaseDate: movieDetails.release_date,
          runtime: movieDetails.runtime,
          title: movieDetails.title,
          voteAverage: movieDetails.vote_average,
          voteCount: movieDetails.vote_count,
          genres: movieDetails.genres,
          spokenLanguages: movieDetails.spoken_languages,
          similarMovies: movieDetails.similar_movies
        }
        setUniqueMovie(formattedMovieDetails)
        setGenres(formattedMovieDetails.genres)
        setSpokenLanguages(formattedMovieDetails.spokenLanguages)
        setSimilarMovies(formattedMovieDetails.similarMovies)
        setIsLoading(false)
      }
    }
    eachMovieDetails()
  }, [movieId, jwtToken])

  return (
    <div>
      <div className="bg-black text-white min-h-screen">
        {/* Banner Section */}
        {isLoading ? (
          <Loading height="h-[100vh]" />
        ) : (
          <div
            className="relative w-full h-[70vh] sm:h-[85vh] lg:h-[100vh] bg-cover bg-center"
            style={{ backgroundImage: `url(${uniqueMovie.backdropPath})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

            {/* Movie Info Overlay */}
            <div className="absolute bottom-10 sm:bottom-16 left-4 sm:left-10 max-w-xl sm:max-w-2xl pr-6">
              <h1 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-3">
                {uniqueMovie.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4">
                <span>
                  {parseInt(uniqueMovie.runtime / 60)}h{" "}
                  {parseInt(uniqueMovie.runtime % 60)}m
                </span>
                <span className="border px-2 py-[2px] rounded text-xs">
                  {uniqueMovie.adult ? "A" : "U/A"}
                </span>
                <span>{new Date(uniqueMovie.releaseDate).getFullYear()}</span>
              </div>
              <p className="text-gray-300 text-xs sm:text-base mb-4 line-clamp-3 sm:line-clamp-4">
                {uniqueMovie.overview}
              </p>
              <button className="bg-white text-black px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition">
                Play
              </button>
            </div>
          </div>
        )}

        {/* Movie Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-4 sm:px-8 lg:px-10 py-8 sm:py-10 text-gray-300 text-sm border-b border-gray-700 -mt-6 sm:-mt-10">
          <div>
            <h3 className="font-semibold mb-2 text-white">Genres</h3>
            <ul>
              {genres.map((eachgenre) => (
                <li key={eachgenre.id}>{eachgenre.name}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-white">Audio Available</h3>
            <ul>
              {SpokenLanguages.map((eachLanguage) => (
                <li key={eachLanguage.id}>{eachLanguage.english_name}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-white">Rating Count</h3>
            <p>{uniqueMovie.voteCount}</p>
            <h3 className="font-semibold mb-2 text-white">Rating Average</h3>
            <p>{uniqueMovie.voteAverage}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-white">Budget</h3>
            <p>{uniqueMovie.budget}</p>
            <h3 className="font-semibold mt-4 text-white">Release Date</h3>
            <p>{uniqueMovie.releaseDate}</p>
          </div>
        </div>

        {/* More Like This */}
        <div className="px-4 sm:px-6 lg:px-10 py-8">
          <h2 className="text-2xl font-semibold mb-6">More like this</h2>
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 w-full max-w-full">
            {SimilarMovies.map((likeMovie) => {
              const details = {
                id: likeMovie.id,
                title: likeMovie.title,
                posterPath: likeMovie.poster_path,
              }
              return <MovieItem key={details.id} eachMovie={details} />
            })}
          </ul>
        </div>
        <div className="flex flex-col justify-center items-center bg-black p-5">
        <div className='flex gap-3'>
          {/* Google */}
          <a href="https://www.google.com" target="_blank" rel="noopener noreferrer">
            <FaGoogle className="text-red-500 text-3xl hover:text-red-700 transition duration-300" />
          </a>
          {/* Instagram */}
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram className="text-pink-500 text-3xl hover:text-pink-700 transition duration-300" />
          </a>
          {/* Twitter (X) */}
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <FaTwitter className="text-blue-500 text-3xl hover:text-blue-700 transition duration-300" />
          </a>
          {/* YouTube */}
          <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
            <FaYoutube className="text-red-600 text-3xl hover:text-red-800 transition duration-300" />
          </a>
        </div>
        <p className='text-white mt-3'>Contact us</p>
      </div>
    </div>
    </div>
  )
}

export default MovieItemDetails
