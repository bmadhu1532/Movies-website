import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";

const Register = () => {
    const navigate = useNavigate();
    const [username,setUsername] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [showErrorMsg,setShowErrMsg] = useState('')
    const [isErr,setIsErr] = useState(false)
    const [isLoading, setIsLoading] = useState(false)


    const handleUsername = (e) =>{
        setUsername(e.target.value)
    }

    const handleEmail = (e) => {
        setEmail(e.target.value)
    }

    const handlePassword = (e) =>{
        setPassword(e.target.value)
    }

    const onSubmitSuccess = () => {
      setIsErr(false)
      navigate("/login",{replace:true})
    }

    const onSubmitFailure = (errorMsg) => {
      setIsErr(true)
      setShowErrMsg(errorMsg)
    }

    const handleSubmitForm=async(event) =>{
        event.preventDefault();
        setIsLoading(true);
        setIsErr(false);
        
        try {
            const userDetails = {username,email,password}
            
            // First, save to MongoDB via your backend API
            const backendResponse = await fetch('http://localhost:5000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userDetails)
            });

            // Safely parse backend response (avoid JSON errors on HTML/error bodies)
            const backendText = await backendResponse.text();
            let backendData = null;
            try { backendData = backendText ? JSON.parse(backendText) : null; } catch { backendData = null; }

            if (!backendResponse.ok) {
                const msg = backendData?.message || backendText || 'Database registration failed';
                throw new Error(msg);
            }

            console.log('Database registration successful:', backendData);

            const webhookUrl = "http://localhost:5678/webhook/8bb676a8-ba1d-4b7d-abc0-5c64c4cbc63a";
            if (webhookUrl) {
                const payload = {
                    username,
                    email,
                    userId: backendData?.user?.userId || undefined,
                };
                fetch(webhookUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                })
                .then((res) => {
                    if (!res.ok) {
                        console.warn('Webhook failed with status:', res.status);
                    }
                })
                .catch((err) => {
                    console.warn('Webhook request error:', err?.message || err);
                });
            }

            onSubmitSuccess();
            
        } catch (error) {
            console.error('Registration error:', error);
            onSubmitFailure(error.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
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
        <h1 className="text-white text-3xl font-bold text-center mb-6">Register</h1>
        
        <form className="flex flex-col space-y-5" onSubmit={handleSubmitForm}>
          {/* Username */}
          <div>
            <label className="text-gray-300 text-xs sm:text-sm font-semibold">USERNAME</label>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              className="w-full p-3 mt-1 bg-gray-800/80 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600"
              onChange={handleUsername}
            />
            
          </div>

          <div>
            <label className="text-gray-300 text-xs sm:text-sm font-semibold">EMAIL</label>
            <input
              type="text"
              placeholder="Enter email"
              value={email}
              className="w-full p-3 mt-1 bg-gray-800/80 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600"
              onChange={handleEmail}
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
            disabled={isLoading}
            className={`${isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'} text-white font-bold py-3 rounded transition`}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="text-white pt-5">Already have an Account ? <Link to={"/login"} className="underline">login</Link></p>
      </div>
    </div>
  );
};

export default Register;
