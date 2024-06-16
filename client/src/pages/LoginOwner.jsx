import React,{useState} from 'react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import {loginOwnerUrl} from '../constant/urls'
// import { useLocation } from "react-router-dom";
import {  useNavigate} from "react-router-dom";
import axios from 'axios';

import "../designs/loginForMessOwner.css"


function LoginOwner() {
  useEffect(()=>{
    document.title="Pg owner login"
},[]);
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [isPasswordVisible,setIsPasswordVisible]=useState(false);

  const navigate = useNavigate();
  const togglePassword = () => {
    setIsPasswordVisible(!isPasswordVisible);
};
const loginHandlerOwner = async (event) =>{
  event.preventDefault();
  console.log("clicked");
  const jsonData = {
    email:email,
    password:password
  };
  try {
    const response = await axios.post(loginOwnerUrl,jsonData,{
      withCredentials :true,
      headers : { 'Content-Type':"application/json"}
  });
  if(response.status === 200){
    console.log("succesfully logged in");
    navigate('/');
  }
  else{
    console.error("Login failed",response.data);
  }


  } catch (error) {
    console.log("Error sending JSON data:",error);
  }
}


  return (
    <body>
    <div className="parent-to-all">
      <div className="col0O"></div>
      <div className="col1O">
        <div className="parentleft">
          <div className="title">Log in</div>
          <div className="business"><span className="business-text">Grow your Business</span>
            <span className="parent-svg"><svg className="big" xmlns="http://www.w3.org/2000/svg" width="36" height="51"
                viewBox="0 0 36 51" fill="none">
                <path d="M35.6606 0.254675L15.2146 50.8656L0.213996 41.7642L35.6606 0.254675Z" fill="#2CA4B5" />
              </svg>
              <svg className="small" xmlns="http://www.w3.org/2000/svg" width="31" height="38" viewBox="0 0 31 38"
                fill="none">
                <path d="M0.388577 37.121L14.2029 0.232107L30.8504 12.1469L0.388577 37.121Z" fill="#2CA4B5" />
              </svg></span>
          </div>
        </div>
      </div>
      <div className="parent-col2">
        <div className="col2O">
          <form className="loginOwnerform"   onSubmit={loginHandlerOwner}>
            <input type="text" name="email" id="e" className="pad e-text" placeholder="Email" autocomplete="off" value={email} onChange={(e)=>setEmail(e.target.value)} />
            <div className="password-con"><input type={isPasswordVisible ? "text" : "password"} id="pass" name="password"  className="p-text" placeholder="Password" autocomplete="off" value={password} onChange={(e)=> setPassword(e.target.value)}/>
            <img id="ey" src={isPasswordVisible ? "../assets/openEye.png" : "../assets/closeEye.png"}alt={isPasswordVisible ? "../assets/openEye.png" : "../assets/closeEye.png"}  onClick={togglePassword} style={{ cursor: 'pointer' }} /></div>
  
            <div className="parent-mid">
              <div className="parent-check"><input type="checkbox" className='checkcheck' name="check" id="c"/>
                <label for="c" className="chk"></label>
                <span>Remember Me</span> </div>
              <div className="forgot">Forget Password?</div>
            </div>
            <button className="pad log-text" type="submit">Log in</button>
            <div className="Parent-not"><span>Don't have any EasyPg account? </span><a className="under" href="signupMessOwner"><Link style={{textDecoration:"none"}} to="/signupOwner">Sign Up</Link></a></div>
            <div className="parent-google"><img src="../assets/google.png" alt=""/>
              <div className="logGoogle-text">Log in with Google</div>
            </div>
          </form>
  
  
        </div>
        <div className="parent-copy"><div className="parent-com"><span className="copyright"> copyright 2024 - All Right Reserved by </span> <span
            className="company"> Easypg.pv.ltd</span></div></div>
      </div>
      <div className="col3O">
        <div className="logo-title">
          <div className="parent-name-business">
            <div className="name"><span className="font one">Easy</span><span className="font two">Pg</span></div>
            <div className="font col3-business">Business</div>
          </div>
  
        </div>
        <div className="parent-lower">
          <div className="grow-with-us-margin"></div>
          <div className="grow-business-parent">
            <div className="size ">Grow</div>
            <div className="size ">Your</div>
            <div className="size ">Business</div>
            <div className="size ">With Us</div>
  
          </div>
          <div className="parent-col-3">
            <div className="lower-col1 height-col"></div>
            <div className="lower-col2 height-col"></div>
            <div className="lower-col3 height-col"></div>
          </div>
        </div>
  
      </div>
    </div>
  
   
  </body>
  )
}

export default LoginOwner;

