import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import "../designs/loginForUser.css";
import "../designs/util.css";
import { loginUrl } from "../constant/urls";
import { useLocation } from "react-router-dom";
import {  useNavigate} from "react-router-dom";
// import ProtectedRoute from "./protectedRoute";

function LoginUser() {
  useEffect(() => {
    document.title = "Student login";
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
   const [message, setMessage] = useState("");
  //  const cookies = new Cookies();
  useEffect(() => {
    // Check if the message should be displayed based on localStorage
    const storedMessage = localStorage.getItem('loginMessage');
    if (storedMessage) {
      setMessage(location.state?.message || "");
    }

    // Remove the message after 5 seconds
    const timer = setTimeout(() => {
      setMessage("");
      localStorage.removeItem('loginMessage'); 
    }, 5000);

    return () => clearTimeout(timer);
  }, [location.state?.message]);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  ////////////////////////////////////////////////////////////////////
  const loginHandler = async (event)=> {
    event.preventDefault();   
    console.log("clicked");
    const jsonData = {
     
      email: email,
      
      password: password,
     
    };
    try {
      const response = await axios.post(loginUrl,jsonData,{
        withCredentials:true,
        headers : { 'Content-Type':"application/json"},
      });
      if(response.status === 200){
        console.log("Response:",response.data);
        // navigate('/');
        // const token =getCookie('user_token'); 
        
        const message =  "Succesfully logged in"
        
        // localStorage.setItem('token', token);
        localStorage.setItem('sId_message',message);
        navigate('/',{state:{message: message}});
        // Cookies.set('user', token);
        window.location.reload();
      }else{
        console.error("Login failed",response.data);
      }
      
    } catch (error) {
        console.log("Error sending JSON data:",error);
    }
  }

  return (
    <body id="container">
      <div className="main">
        <div className="content">
          <div className="hh">
            {" "}
            <div className="loginTitle">Log in</div>
            <div className="welcome">
              <div className="upper">Welcome to</div>{" "}
              <span className="lower1">Easy</span>
              <span className="lower2">Pg</span>
            </div>
          </div>
          <form className="formC" onSubmit={loginHandler}>
            <div className="parentforum">
              <div>
              {message && <p style={{ color: 'red' }}>{message}</p>}
              </div>
              <div className="mainforum">
                <input
                  className="emailText"
                  type="text"
                  name="email"
                  placeholder="Email"
                  autocomplete="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="password-container">
                  <input
                    type={isPasswordVisible ? "text" : "password"}
                    id="password"
                    name="password"
                    className="passwordText"
                    placeholder="Password"
                    autocomplete="off"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <img
                    id="eye"
                    src={
                      isPasswordVisible
                        ? "./assets/openEye.png"
                        : "./assets/closeEye.png"
                    }
                    alt={isPasswordVisible ? "openEye" : "closeEye"}
                    onClick={togglePasswordVisibility}
                    style={{ cursor: "pointer" }}
                  />
                </div>
                <button
                  className="loginSubmit" type="submit" >
                  Log in
                </button>
                <br />
                <div className="or">Or</div>
                <br />
                <div className="parentSignupGoogle">
                  <div className="signupGoogle">
                    <img
                      className="googleimg"
                      src="../assets/google.png"
                      alt=""
                      srcset=""
                    />
                    <div className="signupwithgoogleText">
                      Sign up with Google Account
                    </div>
                  </div>
                </div>
                <br />
                <div className="parentnotAccount">
                  {" "}
                  <div className="notAccount">
                    Don't have any EasyPg account?
                    <a
                      className="whoareyou"
                      id="signupLink"
                      href="./signupforuser"
                    >
                      <Link
                        style={{ textDecoration: "none" }}
                        to="/signupforuser"
                      >
                        Sign Up
                      </Link>{" "}
                    </a>{" "}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="findNearestMess">
          <div className="parent-img">
            <img
              className="ellipseeep"
              src="../assets/Ellipse.png"
              alt=""
              srcset=""
            />
          </div>
          <div className="parent-elipse">
            <div className="FindyourNearestMess">Find your Nearest Mess</div>
          </div>
          <div className="parent-column">
            <div className="col1L"></div>
            <div className="col2L"></div>
            <div className="col3L"></div>
          </div>
        </div>
      </div>
    </body>
  );
}

export default LoginUser;
