import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../designs/signuppagestyle.css";
import { useEffect } from "react";
import axios from "axios";
import { signupUrl } from "../constant/urls";

function SignUpForm() {
  useEffect(() => {
    document.title = "Student signup";
  }, []);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  function signupHandler() {
    console.log("clicked");

    const jsonData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      address: address,
      password: password,
      pin: pin,
    };
    axios
      .post(signupUrl, jsonData, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        console.log("Response:", response.data);
      })
      .catch((error) => {
        console.error("Error sending JSON data:", error);
      });
  }
  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handlePinChange = (e) => {
    setPin(e.target.value);
  };
  return (
    <div id="Maincontainer">
      <div className="form-container">
        Sign Up <span className="fs">User</span>
        <div className="leftcontainer">
          <div className="create-account-grid">
            <div className="CA">Create Account</div>
            <div className="first-name">
              <input
                type="first-name"
                id="first-name"
                placeholder="First Name"
                value={firstName}
                onChange={handleFirstNameChange}
              />
            </div>
            <div className="last-name">
              <input
                type="last-name"
                id="last-name"
                placeholder="Last Name"
                value={lastName}
                onChange={handleLastNameChange}
              />
            </div>
            <div className="email">
              <input
                type="email"
                name="email"
                id="email"
                placeholder="example@email.com"
                value={email}
                onChange={handleEmailChange}
              />
            </div>
            <div className="address">
              <input
                type="address"
                id="address"
                placeholder="Enter Your Address"
                value={address}
                onChange={handleAddressChange}
              />
            </div>
            <div className="pass-container">
              <div className="pass">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={handlePasswordChange}
                />
                <img
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
            </div>

            <div className="pin">
              <input
                type="pin"
                name="pin"
                id="pin"
                placeholder="Pin Code"
                value={pin}
                onChange={handlePinChange}
              />
            </div>
            <button className="create-account" onClick={signupHandler}>
              Create Account
            </button>
            <button className="google-sign-up">
              <img src="./assets/googleIcon.png" alt="googleIcon" />
              Signup with google
            </button>
          </div>
        </div>
      </div>
      <div className="rightcontainer">
        <div className="easy-pg">
          Easy <span>Pg</span>
        </div>
        <div className="try">
          <div className="ellipse">
            <img src="./assets/ellipse-2.png" alt="upper-ellipse" />
          </div>
          <div className="mid-text">Find Your Nearest Mess</div>
        </div>

        <div className="login-button">
          <button>
            <Link
              style={{ textDecoration: "none", color: "white" }}
              to="/LoginUser"
            >
              Log In
            </Link>
          </button>
        </div>
        <div className="bottom-ellipse">
          <img src="./assets/bottom-ellipse.png" alt="bottom-ellipse" />
        </div>
      </div>
    </div>
  );
}

export default SignUpForm;
