import React, { useState } from "react";
import Cookies from "js-cookie";
import { Link, Navigate, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const navigate = useNavigate();
    const { setAuthData } = useAuth();
    const [email,setEmail] = useState('') 
    const [password,setPassword] = useState('')
    const [showErrorMsg,setShowErrMsg] = useState('')
    const [isErr,setIsErr] = useState(false)


    const handleUseremail = (e) =>{
        setEmail(e.target.value)
    }

    const handlePassword = (e) =>{
        setPassword(e.target.value)
    }

    const onSubmitSuccess = (jwtToken) => {
      Cookies.set("jwt_token",jwtToken,{expires:7})
      setAuthData({ email, password, jwtToken });
      setIsErr(false)
      navigate("/",{replace:true})
    }

    const onSubmitFailure = (errorMsg) => {
      setIsErr(true)
      setShowErrMsg(errorMsg)
    }

    const handleSubmitForm=async(event) =>{
        event.preventDefault();
        const userDetails = {email,password}
        const apiUrl = "https://projectmovies-1.onrender.com/login";
        const options = {
          method:"POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userDetails)
        }
        const response = await fetch(apiUrl,options);
        const data = await response.json()
        if (response.ok===true) {
          onSubmitSuccess(data.jwt_token)
        }
        else {
          onSubmitFailure(data.message);
        }    
    }

    const jwtToken = Cookies.get("jwt_token")
    if (jwtToken!==undefined) {
      return <Navigate to="/" />
    }
   

  return (
    <div className="min-h-screen w-full bg-[url('https://res.cloudinary.com/dcttatiuj/image/upload/v1756136399/8ccaf66f19edc15e3aa6b6a1301fd6667bf2509e_1_xkw5s3.jpg')] bg-cover bg-center relative flex items-center justify-center px-4 sm:px-6">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Header Logo (Image) */}
      <header className="absolute top-4 left-4 sm:top-6 sm:left-10 z-20">
        <img
          src="https://res.cloudinary.com/dcttatiuj/image/upload/v1756137061/Group_7399_l7pcod.png"  
          alt="Movies Logo"
          className="h-10 sm:h-12 w-auto"
        />
      </header>

      {/* Login Box */}
      <div className="relative z-10 bg-black/70 p-6 sm:p-8 md:p-10 rounded-xl w-full max-w-[360px] border border-blue-400 shadow-lg">
        <h1 className="text-white text-3xl font-bold text-center mb-6">Login</h1>
        
        <form className="flex flex-col space-y-5" onSubmit={handleSubmitForm}>
          {/* Username */}
          <div>
            <label className="text-gray-300 text-xs sm:text-sm font-semibold">EMAIL</label>
            <input
              type="text"
              placeholder="Enter email"
              value={email}
              className="w-full p-3 mt-1 bg-gray-800/80 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600"
              onChange={handleUseremail}
            />
            
          </div>

          {/* Password */}
          <div>
            <label className="text-gray-300 text-xs sm:text-sm font-semibold">PASSWORD</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              className="w-full p-3 mt-1 bg-gray-800/80 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600"
              onChange={handlePassword}
            />
            
          </div>
          {isErr ? <p className="text-red-500 text-sm">{showErrorMsg}</p> : '' }
          {/* Submit Button */}
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded transition cursor-pointer"
          >
            Login
          </button>
          <p className="text-white pt-2">Already have an Account ? <Link to={"/register"} className="underline">Register</Link></p>
        </form>
      </div>
    </div>
  );
};

export default Login;


// import React, { useState } from "react";
// import Cookies from "js-cookie";
// import { Link, Navigate, useNavigate } from "react-router";
// import { useAuth } from "../context/AuthContext";

// const Login = () => {
//     const navigate = useNavigate();
//     const { setAuthData } = useAuth();
//     const [username,setUsername] = useState('') 
//     const [password,setPassword] = useState('')
//     const [showErrorMsg,setShowErrMsg] = useState('')
//     const [isErr,setIsErr] = useState(false)


//     const handleUsername = (e) =>{
//         setUsername(e.target.value)
//     }

//     const handlePassword = (e) =>{
//         setPassword(e.target.value)
//     }

//     const onSubmitSuccess = (jwtToken) => {
//       Cookies.set("jwt_token",jwtToken,{expires:7})
//       setAuthData({ username, password, jwtToken });
//       setIsErr(false)
//       navigate("/",{replace:true})
//     }

//     const onSubmitFailure = (errorMsg) => {
//       setIsErr(true)
//       setShowErrMsg(errorMsg)
//     }

//     const handleSubmitForm=async(event) =>{
//         event.preventDefault();
//         const userDetails = {username,password}
//         const apiUrl = "https://apis.ccbp.in/login";
//         const options = {
//           method:"POST",
//           body: JSON.stringify(userDetails)
//         }
//         const response = await fetch(apiUrl,options);
//         const data = await response.json()
//         if (response.ok===true) {
//           onSubmitSuccess(data.jwt_token)
//         }
//         else {
//           onSubmitFailure(data.error_msg)
//         }    
//     }

//     const jwtToken = Cookies.get("jwt_token")
//     if (jwtToken!==undefined) {
//       return <Navigate to="/" />
//     }
   

//   return (
//     <div className="min-h-screen w-full bg-[url('https://res.cloudinary.com/dcttatiuj/image/upload/v1756136399/8ccaf66f19edc15e3aa6b6a1301fd6667bf2509e_1_xkw5s3.jpg')] bg-cover bg-center relative flex items-center justify-center px-4 sm:px-6">
//       {/* Overlay */}
//       <div className="absolute inset-0 bg-black/60"></div>

//       {/* Header Logo (Image) */}
//       <header className="absolute top-4 left-4 sm:top-6 sm:left-10 z-20">
//         <img
//           src="https://res.cloudinary.com/dcttatiuj/image/upload/v1756137061/Group_7399_l7pcod.png"  
//           alt="Movies Logo"
//           className="h-10 sm:h-12 w-auto"
//         />
//       </header>

//       {/* Login Box */}
//       <div className="relative z-10 bg-black/70 p-6 sm:p-8 md:p-10 rounded-xl w-full max-w-[360px] border border-blue-400 shadow-lg">
//         <h1 className="text-white text-3xl font-bold text-center mb-6">Login</h1>
        
//         <form className="flex flex-col space-y-5" onSubmit={handleSubmitForm}>
//           {/* Username */}
//           <div>
//             <label className="text-gray-300 text-xs sm:text-sm font-semibold">USERNAME</label>
//             <input
//               type="text"
//               placeholder="Enter username"
//               value={username}
//               className="w-full p-3 mt-1 bg-gray-800/80 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600"
//               onChange={handleUsername}
//             />
            
//           </div>

//           {/* Password */}
//           <div>
//             <label className="text-gray-300 text-xs sm:text-sm font-semibold">PASSWORD</label>
//             <input
//               type="password"
//               placeholder="Enter password"
//               value={password}
//               className="w-full p-3 mt-1 bg-gray-800/80 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600"
//               onChange={handlePassword}
//             />
            
//           </div>
//           {isErr ? <p className="text-red-500 text-sm">{showErrorMsg}</p> : '' }
//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded transition cursor-pointer"
//           >
//             Login
//           </button>
//           <p className="text-white pt-2">Already have an Account ? <Link to={"/register"} className="underline">Register</Link></p>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;
