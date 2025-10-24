import React, { useEffect, useState } from 'react'
import NavbarPage from '../header'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router'
import { FaGoogle, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
// import { useAuth } from '../context/AuthContext';

function AccountPage() {
  const navigate = useNavigate();
  // const { authData } = useAuth();
  // const [see,setSee] = useState(false)
  // const [password,setPassword] = useState(false)
  const jwtToken = Cookies.get("jwt_token")

  const [userData,setUserData] = useState({})

  const handleLogout = ()=>{
    if (jwtToken!==undefined) {
      Cookies.remove("jwt_token")
      navigate("/login",{replace:true})
    }
  }
  // const originalPass = authData.password
  // const star = '*'.repeat(originalPass.length);

  // const seePassword = () => {
  //   setPassword(true)
  //   setSee(true)
  // }

  // const HidePassword = () => {
  //   setPassword(false)
  //   setSee(false)
  // }


  useEffect(()=> {
    const fetchProfile = async() => {
      const url = "https://projectmovies-1.onrender.com/profile"
      const options = {
        method:"GET",
        headers : {
          Authorization: `Bearer ${jwtToken}`
        }
      }
      const response = await fetch(url,options)
      // console.log(response)
      if (response.ok) {
        const data = await response.json()
        setUserData(data.userDetails)
      }
    }
    fetchProfile()
  },[])
  
  console.log(userData)

  return (
    <div>
      <div className='bg-black h-[60px] sm:h-[76px]'>
        <NavbarPage />
      </div>
      <div className="flex justify-center items-center min-h-[70vh] bg-black px-4 sm:px-6">
        <div className="w-full max-w-2xl bg-white p-6 sm:p-8">
          <h1 className="text-xl sm:text-2xl font-bold mb-6">Account</h1>

          {/* Membership Section */}
          <div className="border-t border-b py-4">
            <p className="text-gray-600 font-medium mb-2">Member ship</p>
            <p className='text-gray-700 break-all'><strong>Username:</strong> {userData.username} </p>
            <p className='text-gray-700 break-all'><strong>Email:</strong> {userData.email} </p>
            {/* {!see ? <button className='mt-2 bg-gray-200 border px-3 py-1 rounded-md' onClick={seePassword}>see password</button> : <button className='mt-2 bg-gray-200 border px-3 py-1 rounded-md' onClick={HidePassword}>hide password</button> } */}
          </div>

          {/* Plan Details Section */}
          <div className="border-b py-4">
            <p className="text-gray-600 font-medium mb-2">Plan details</p>
            <div className="flex items-center gap-3">
              <span className="text-gray-800 font-medium">Premium</span>
              <span className="text-xs border px-2 py-1 rounded bg-gray-100 text-gray-700">
                Ultra HD
              </span>
            </div>
          </div>

          {/* Logout Button */}
          <div className="flex justify-center mt-6">
            <button className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-6 py-2 rounded cursor-pointer" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center bg-black p-5">
        <div className='flex gap-3'>
          <a href="https://www.google.com" target="_blank" rel="noopener noreferrer">
            <FaGoogle className="text-red-500 text-3xl hover:text-red-700 transition duration-300 mr-2" />
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram className="text-pink-500 text-3xl hover:text-pink-700 transition duration-300 mr-2" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <FaTwitter className="text-blue-500 text-3xl hover:text-blue-700 transition duration-300 mr-2" />
          </a>
          <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
            <FaYoutube className="text-red-600 text-3xl hover:text-red-800 transition duration-300 mr-2" />
          </a>
        </div>
        <p className='text-white'>Contact us</p>
      </div>
    </div>
  )
}

export default AccountPage
