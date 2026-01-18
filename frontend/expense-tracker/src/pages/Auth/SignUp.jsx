import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/Layout/AuthLayout'
import Input from '../../components/Inputs/Input'
import { validateEmail } from '../../utils/helper'
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPath'
import { UserContext } from '../../context/UserContext'
import uploadImage from '../../utils/uploadImage'
const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [error, setError] = useState(null)

  const {updateUser} = useContext(UserContext);

  const navigate = useNavigate();

  const handleSubmit = async (e) => { 
    e.preventDefault();
    // Simple validation
    if(!fullName){
      setError("Please enter your full name.");
      return;
    }
    if(!validateEmail(email)){
      setError("Please enter a valid email address.");
      return;
    }
    if(!password){
      setError("Please enter a password.");
      return;
    }
    if(password.length < 8){
      setError("Password must be at least 8 characters long.");
      return;
    }
    if(!confirmPassword){
      setError("Please confirm your password.");
      return;
    }
    if(password !== confirmPassword){
      setError("Passwords do not match.");
      return;
    }
    setError(null);
    
    // signup api
    try {

      // upload image if present
      let profileImageUrl;
      if(profilePic){
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER,{
        fullName,
        email,
        password,
        profileImageUrl
      });

      const {token, user} = response.data;
      if(token){
        localStorage.setItem("token",token);
        updateUser(user); // updateUser now also syncs localStorage
        navigate("/dashboard");
      }
    } catch (error) {
      if(error.response && error.response.data.message){
        setError(error.response.data.message);
      }else{
        setError("Something went Wrong. Please try again.");
      }
    }
  }

  return (
    <AuthLayout>
      <div className='lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Create an Account</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>Join us today by entering your details below</p>


        <form onSubmit={handleSubmit}>

          <ProfilePhotoSelector
            image={profilePic}
            setImage={setProfilePic}
          />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              type="text"
              label="Full Name"
              placeholder="Enter your full name"
            />
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
            <Input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              label="Confirm Password"
              placeholder="Re-enter your password"
            />


          </div>

          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

          <button
            type='submit'
            className='btn-primary'
          >
            Sign Up
          </button>

          <p className='text-[13px] text-slate-800 mt-3'>
            Already have an account? <Link className='text-primary font-medium cursor-pointer' to="/login"> Log In</Link>
          </p>

        </form>


      </div>
    </AuthLayout>
  )
}

export default SignUp