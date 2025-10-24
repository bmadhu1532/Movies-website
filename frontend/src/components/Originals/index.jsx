import { useEffect, useState, useRef } from 'react'
import { ChevronLeft, ChevronRight, AlertTriangle  } from "lucide-react";
import Loading from '../Loading';
import Cookies from 'js-cookie';
import MovieItem from '../MovieItem';
import './index.css'

const apiStatusConstants = {
  initial:"INITIAL",
  inProgress:"IN_PROGRESS",
  success:"SUCCESS",
  failure:"FAILURE"
}

function Originals() {
  const [moviesData, setMoviesData] = useState({
    status:apiStatusConstants.initial,
    data:null,
    errorMsg:null,
  })

  const jwtToken = Cookies.get("jwt_token")
  const scrollRef = useRef(null)

  const TrendingMoviesData = async () => {
      setMoviesData({
        status:apiStatusConstants.inProgress,
        data:null,
        errorMsg:null,        
      })
      const apiUrl = "https://projectmovies-1.onrender.com/movies-app/originals"
      const options = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwtToken}`
        }
      }
      const response = await fetch(apiUrl, options)
      if (response.ok) {
        const data = await response.json()
        console.log(data)
        const formattedData = data.results.map(eachMovie => ({
          id: eachMovie.id,
          title: eachMovie.title,
          posterPath: eachMovie.poster_path,
          backdropPath: eachMovie.backdrop_path,
          overview: eachMovie.overview
        }))
        setMoviesData({
          status:apiStatusConstants.success,
          data:formattedData,
          errorMsg:null,
        })
      }else {
        setMoviesData({
          status:apiStatusConstants.failure,
          data:null,
          errorMsg:null,
        })
      }
    }

  useEffect(() => {
    TrendingMoviesData()
  }, [])

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: "smooth" })
    }
  }

  const renderSuccessView = () =>{
    const {data} = moviesData
    return (
      <div className="bg-black text-white">
        <div className="relative flex items-center px-2 sm:px-4">
          {/* Left Arrow */}
          <button
            onClick={scrollLeft}
            className="absolute left-1 sm:left-0 z-10 bg-black/60 hover:bg-black p-2 rounded-full"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          {/* Movie List */}
          <div
            ref={scrollRef}
            className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth py-2"
          >
            {data.map(movie => (
              <div key={movie.id} className="snap-start">
                <MovieItem eachMovie={movie} />
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={scrollRight}
            className="absolute right-0 z-10 bg-black/70 hover:bg-black p-2 rounded-full"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    )
    
  }

  const renderFailureView = () => {
    return (
      <div className="flex flex-col items-center justify-center bg-black text-white w-full h-[300px] rounded-lg border-2 border-blue-500">
        {/* Warning Icon */}
        <AlertTriangle className="text-red-500 w-12 h-12 mb-4" />

        {/* Error Message */}
        <p className="text-center text-gray-300 mb-4">
          Something went wrong. Please try again
        </p>

        {/* Retry Button */}
        <button
          onClick={TrendingMoviesData}
            className="bg-white text-black font-medium px-4 py-2 rounded-md shadow hover:bg-gray-200 transition"
        >
            Try Again
        </button>
      </div>
    );
  }

   const renderLoadingView = () => {
    return (
      <div className="flex justify-center items-center w-full h-[200px]">
        <Loading height="h-[100px]" />
      </div>
    )
  }
  const renderView = () => {
    const {status} = moviesData

    switch (status) {
      case apiStatusConstants.success:
        return renderSuccessView()
      case apiStatusConstants.inProgress:
        return renderLoadingView()
      case apiStatusConstants.failure:
        return renderFailureView()
      default:
        return null
    }
  }

 return (
  <div className="bg-black text-white px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
    <h2 className="text-lg sm:text-xl font-semibold mb-4">Originals</h2>
    {renderView()}
  </div>
 )

}

export default Originals
