import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import "../designs/loginForUser.css";
import "../designs/util.css";
import { loginUrl } from "../constant/urls";

function LoginUser() {
  useEffect(() => {
    document.title = "Student login";
  }, []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  function loginHandler() {
    console.log("clicked");

    const jsonData = {
     
      email: email,
      
      password: password,
     
    };
    axios
      .post(loginUrl, jsonData, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        console.log("Response:", response.data);
      })
      .catch((error) => {
        console.error("Error sending JSON data:", error);
      });
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
