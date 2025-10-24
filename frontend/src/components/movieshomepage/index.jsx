import TrendingMovies from '../TrendingMovies'
import Originals from '../Originals'
import MovieBanner from '../MovieBanner'
import { FaGoogle, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

function MovieHomepage() {

  

  return (
    <div className='bg-black h-auto'>
      <MovieBanner />
      <TrendingMovies />
      <Originals />
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

export default MovieHomepage

