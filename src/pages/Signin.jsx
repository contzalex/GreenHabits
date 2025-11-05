import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = ({ setIsLoggedIn }) => {
    const navigate = useNavigate();
    const [isLoginMode, setIsLoginMode] = useState(false);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoggedIn(true);
        navigate('/profile');
    };
    
  return (
    <div className='w-[430px] bg-mint p-8 rounded-2xl shadow-lg mx-auto mt-4'>
        {/* Header */}
        <div className='flex justify-center mb-4'>
            <h2 className='text-3xl font-semibold text-center text-darkgreen'>
                {isLoginMode ? 'Welcome Back!' : 'Create an Account'}
            </h2>
        </div>

        {/* Tab controls */}
        <div className='relative flex h-12 mb-6 border-2 border-darkgreen rounded-full overflow-hidden'>
            <button 
                type="button"
                onClick={() => setIsLoginMode(true)} 
                className={`w-1/2 text-lg font-medium transition-all z-10 ${isLoginMode ? 'text-white bg-darkgreen' : 'text-darkgreen bg-lightgreen'}`}>
                Login
            </button>
            <button 
                type="button"
                onClick={() => setIsLoginMode(false)}
                className={`w-1/2 text-lg font-medium transition-all z-10 ${!isLoginMode ? 'text-white bg-darkgreen' : 'text-darkgreen bg-lightgreen'}`}>
                Sign Up
            </button>
            <div className={`absolute top-0 h-full w-1/2 rounded-full bg-darkgreen transition-all ${isLoginMode ? 'left-0' : 'left-1/2'}`}></div>
        </div>
        
        {/* Form */}
        <div>
            <form onSubmit={handleSubmit}>
                {!isLoginMode && (
                    <input type="text" placeholder="Username" required className='w-full p-3 mb-3 rounded-lg border-2 border-darkgreen outline-none focus:border-darkgreen placeholder-darkgreen bg-lightgreen text-darkgreen'/>
                )}

                {/* Shared */}
                <input type="email" placeholder="Email Address" required className='w-full p-3 mb-3 rounded-lg border-2 border-darkgreen outline-none focus:border-darkgreen placeholder-darkgreen bg-lightgreen text-darkgreen'/>
                <input type="password" placeholder="Password" required className='w-full p-3 mb-3 rounded-lg border-2 border-darkgreen outline-none focus:border-darkgreen placeholder-darkgreen bg-lightgreen text-darkgreen'/>

                {/* Signup mode only */}
                {!isLoginMode && (
                    <input type="password" placeholder="Confirm Password" required className='w-full p-3 mb-3 rounded-lg border-2 border-darkgreen outline-none focus:border-darkgreen placeholder-darkgreen bg-lightgreen text-darkgreen'/>
                )}

                {/* Forgot password - login mode only */}
                {isLoginMode && (
                    <div className='text-right mt-2 mb-4'>
                       <p className='text-darkgreen hover:underline rounded-full text-sm font-medium hover:opacity-90 transition cursor-pointer'>Forgot password?</p>
                    </div>
                )}

                 {/* Submit button */} 
                 <button type="submit" className='w-full p-3 text-darkgreen font-medium bg-lightgreen rounded-full hover:opacity-90 transition mb-4 border-2 border-darkgreen'>
                    {isLoginMode ? 'Login' : 'Sign Up'}
                </button>

                {/* Switch mode link */}
                <p className='text-center text-darkgreen'> 
                    {isLoginMode ? "Don't have an account?" : "Already have an account?"}
                    <a href="#" onClick={(e) => { e.preventDefault(); setIsLoginMode(!isLoginMode); }} className='text-darkgreen hover:underline rounded-full ml-2 font-medium hover:opacity-90 transition'>
                        {isLoginMode ? 'Sign Up' : 'Login'}
                    </a>    
                </p>
            </form>
        </div>
    </div>
  )
}

export default Login