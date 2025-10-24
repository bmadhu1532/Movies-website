import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { Navigate } from 'react-router'
import Loading from '../Loading'
import MovieItem from '../MovieItem'
import { FaGoogle, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

function PopularPage() {
  const [popularMovies,setPopularMovies] = useState([])
  const [isLoading,setIsloading] = useState(true);
  const [currentPage,setCurrentPage] = useState(1);
  // const [classname,setClassname] = useState(false)

  const itemsPerPage = 10
  const TotalPages = 3

  const startPageIndex = (currentPage-1)*itemsPerPage
  const endPageIndex = startPageIndex+itemsPerPage
  const buttons = []

  const jwtToken = Cookies.get("jwt_token")

  useEffect(()=> {
    const PopularMoviesData = async () => {
      // const apiUrl = "https://apis.ccbp.in/movies-app/popular-movies";
      const apiUrl = "https://projectmovies-1.onrender.com/movies-app/popular-movies";
      const options = {
        method:"GET",
        headers: {
          Authorization: `Bearer ${jwtToken}`
        }
      }
      const response = await fetch(apiUrl,options)
      if (response.ok===true) {
        const data = await response.json();
        console.log(data)
        const ArrayMoviesData = data.results
        const FormattedMoviesData = ArrayMoviesData.map(eachMovie => ({
          id:eachMovie.id,
          title:eachMovie.title,
          posterPath:eachMovie.poster_path,
          backdropPath:eachMovie.backdrop_path
        }))
        setPopularMovies(FormattedMoviesData)
        setIsloading(false)
      }
    }
    PopularMoviesData();
  },[jwtToken])

  for (let i=1;i<=TotalPages;i++) {
    buttons.push(i)
  }

  const handlePrev = () => {
    if(currentPage>1) {
      setCurrentPage(prev=>prev-1)
    }
  }
  const handleNext = () => {
    if(currentPage<TotalPages) {
      setCurrentPage(prev=>prev+1)
    }
  }

  if (jwtToken===undefined) {
    return <Navigate to="/login" />
  }

  const handleEachNumber = (page) => {
    // setClassname(true)
    setCurrentPage(page)
  }

  const CurrentItemsPerPage = popularMovies.slice(startPageIndex,endPageIndex)

  return (
    <div>
        <div className="bg-black min-h-screen px-4 sm:px-6 lg:px-10 py-8">
          {isLoading? <Loading height="h-[60vh]"  />: 
          <div className="w-full max-w-6xl mx-auto my-6 sm:my-10">
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {CurrentItemsPerPage.map((movie) => (
                <MovieItem key={movie.id} eachMovie={movie} />
              ))}
            </ul>
          </div>}
        </div>
        <div className='flex bg-black justify-center'>
          <button className='text-white border border-white p-1 mr-2 rounded-lg' onClick={handlePrev}>prev</button>
          <ul className='flex'>
            {buttons.map((each,index)=>(
              <li  
                key={index} 
                onClick={()=>handleEachNumber(each)} 
                className={`pl-2 pr-2 cursor-pointer rounded 
                  ${currentPage === each 
                    ? 'bg-white text-black font-bold' 
                    : 'bg-black text-white border border-white'}`}
              >
                {each}
              </li>
            ))}2
          </ul>
          <button className='bg-black text-white border border-white p-1 rounded-lg ml-2' onClick={handleNext}>next</button>
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
  )
}

export default PopularPage
