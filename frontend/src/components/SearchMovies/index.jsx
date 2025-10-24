import React from 'react'
import Cookies from 'js-cookie'
import { useEffect,useState } from 'react'
import { useNavigate } from 'react-router';
import Loading from '../Loading';
import MovieItem from '../MovieItem';
import { useAuth } from "../context/AuthContext";


const apiStatusConstants = {
  initial:"INITIAL",
  inProgress:"IN_PROGRESS",
  success:"SUCCESS",
  failure:"FAILURE"
}

function SearchMovie() {
  const navigate = useNavigate()

  const [moviesData, setMoviesData] = useState({
    status:apiStatusConstants.initial,
    data:null,
    errorMsg:null,
  })

  const { searchValue } = useAuth(); 
  if (searchValue==="") {
    navigate("/",{replace:true})
  }

  const jwtToken = Cookies.get("jwt_token")
  
  const SearchMovieData = async () => {
      setMoviesData({
        status:apiStatusConstants.inProgress,
        data:null,
        errorMsg:null,        
      })
      const apiUrl = `https://projectmovies-1.onrender.com/movies-app/movies-search?search=${searchValue}`
      // const apiUrl = `https://apis.ccbp.in/movies-app/movies-search?search={searchText}`
      const options = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwtToken}`
        }
      }
      const response = await fetch(apiUrl, options)
      if (response.ok) {
        const data = await response.json()

        if (data.results.length === 0) {
          setMoviesData({
            status: apiStatusConstants.failure,
            data: null,
            errorMsg: "No movies found for your search.",
          })
          return
        }

        const formattedData = data.results.map(eachMovie => ({
          id: eachMovie.id,
          title: eachMovie.title,
          posterPath: eachMovie.poster_path,
          backdropPath: eachMovie.backdrop_path,
          overview: eachMovie.overview
        }))
        console.log(formattedData)
        setMoviesData({
          status:apiStatusConstants.success,
          data:formattedData,
          errorMsg:null,
        })
      }else {
        setMoviesData({
          status:apiStatusConstants.failure,
          data:null,
          errorMsg:"Something went wrong. Please try again.",
        })
      }
    }

  useEffect(() => {
    SearchMovieData()
  }, [searchValue,setMoviesData])

  const renderSuccessView = () =>{
    const {data} = moviesData
    return (
      <div>
        <div className="bg-black min-h-screen px-4 sm:px-6 lg:px-10 py-8"> 
          <div className="w-full max-w-6xl mx-auto my-6 sm:my-10">
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {data.map((movie) => (
                <MovieItem key={movie.id} eachMovie={movie} />
              ))}
            </ul>
          </div>
        </div>
    </div>
    )
    
  }

  const renderFailureView = () => {
    return (
      <div className='bg-black h-screen flex flex-col justify-center items-center text-center'>
        <div className=' relative top-10'>
          <img src="https://res.cloudinary.com/dcttatiuj/image/upload/v1756830977/Group_7394_q7hyec.png"  />
        </div>
        {/* Message */}
        <p className=" text-lg text-gray-400 mt-10">
          Your search for <span className="font-semibold text-red-500">"{searchValue}"</span> did not find any matches.
        </p>
    </div>
    );
  }

   const renderLoadingView = () => {
    return (
      <div className="flex justify-center items-center w-full h-[100vh]">
        <Loading height="h-[100vh]" />
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
    <>
      {renderView()}
    </>
  )
}

export default SearchMovie
