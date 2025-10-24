import React, { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import Loading from '../Loading'
import MovieBannerCarousel from '../EachMovieBanner'

function MovieBanner() {
  const [Banner, setBanner] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const jwtToken = Cookies.get("jwt_token")
  // console.log(jwtToken)

  useEffect(() => {
    const bannerData = async () => {
      // const apiUrl = "https://apis.ccbp.in/movies-app/top-rated-movies"
      const apiUrl = "https://projectmovies-1.onrender.com/movies-app/top-rated-movies"
      const options = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwtToken}`
        }   
      }
      const response = await fetch(apiUrl, options)

      if (response.ok) {
        const data = await response.json()
        const formattedBannerData = data.results.map(eachBanner => ({
          id: eachBanner.id,
          backdropPath: eachBanner.backdrop_path,
          title: eachBanner.title,
          posterPath: eachBanner.poster_path,
          overview: eachBanner.overview
        }))
        setBanner(formattedBannerData)
        // console.log(data)
      }
      setIsLoading(false)
    }

    bannerData()
  }, [jwtToken])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[100vh] sm:h-[70vh] lg:h-[90vh] bg-black">
        <Loading height="h-[80px] sm:h-[100px]" />
      </div>
    )
  }

  return <MovieBannerCarousel banners={Banner} />
}

export default MovieBanner
