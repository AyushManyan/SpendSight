import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/Layout/AuthLayout'
import Input from '../../components/Inputs/Input'
import { validateEmail } from '../../utils/helper'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPath'
import { UserContext } from '../../context/UserContext'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const {updateUser} = useContext(UserContext);

  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();
    // Simple validation
    if(!validateEmail(email)){
      setError("Please enter a valid email address.");
      return;
    }
    if(!password){
      setError("Please enter your password.");
      return;
    }
    setError("");
    // Proceed with login logic

    try{
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password
      });

      const { token, user } = response.data;
      if(token){
        localStorage.setItem('token', token);
        updateUser(user); // updateUser now also syncs localStorage
        navigate("/dashboard");
      }
    }catch(error){
      if(error.response && error.response.data.message){
        setError(error.response.data.message);
      }else{
        setError("Something went wrong. Please try again.");
      }
    }
  }  

  return (
    <AuthLayout>
      <div className='lg:w-[70%] min-h-3/4 md:h-full flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Welcome Back</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>Please enter your login details</p>
        <form onSubmit={handleLogin}>

          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value.toLowerCase())}
            type="text"
            label="Email Address"
            placeholder="Enter your email"
          />
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            label="Password"
            placeholder="Min 8 characters"
          />

          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

          <button
            type='submit'
            className='btn-primary'
          >
            Login
          </button>

          <p className='text-[13px] text-slate-800 mt-3'>
            Don't have an account? <Link className='text-primary font-medium cursor-pointer' to="/signup">Sign Up</Link>
          </p>

        </form>


      </div>
    </AuthLayout>
  )
}

export default Login