
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

import "../designs/style.css";
import FlashMessage from "../components/flashMessage";
import UserProfile from "../components/UserProfile";
import "../designs/UserProfile.css";

import { useAuth } from "../contexts/AuthContext";

function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState("");
  const [searchItem, setSearchItem] = useState("");
  // const [IsAuthenticated, setIsAuthenticated] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [logoutStatus, setLogoutStatus] = useState("");
  const { userName, IsAuthenticated, handleLogout, logoutSuccess,isOwnerAuthenticated,ownerName } = useAuth();
 

  useEffect(() => {
    document.title = "Find your nearest paying guest";
  }, []);

  const performSearch = () => {
    alert("Searching for: " + searchItem);
    navigate("/newMessFind");
  };

  useEffect(() => {
    const storedMessage = localStorage.getItem("sId_message");
    if (storedMessage) {
      setMessage(location.state?.message || "");
    }

    const timer = setTimeout(() => {
      setMessage("");
      localStorage.removeItem("sId_message");
    }, 5000);

    return () => clearTimeout(timer);
  }, [location.state?.message]);

  useEffect(() => {
    if (IsAuthenticated ) {
      try {
        // Decode token

        // console.log("user name:", userName);
      }
       catch (error) {
        console.error("Error decoding or accessing token:", error);
      }
    }else if(isOwnerAuthenticated){
      try {
        // Decode token

        console.log("user name:", ownerName);
       
      }
       catch (error) {
        console.error("Error decoding or accessing token:", error);
      }
    }
     else {
      console.error("Token is not present in cookies");
    }
  }, [IsAuthenticated, userName,isOwnerAuthenticated,ownerName]);
  useEffect(() => {
    const storedLogoutStatus = localStorage.getItem("logoutStatus");
    if (storedLogoutStatus) {
      setLogoutStatus(storedLogoutStatus);
      setTimeout(() => {
        localStorage.removeItem("logoutStatus");
        setLogoutStatus(""); // Clear the state as well
      }, 5000);
    }
  }, []);
  const handleLogoutClick = () => {
    handleLogout();
  };

  return (
    <body>
      <section className="first-section">
        <header>
          <div className="Container">
            <div className="easypg">
              Easy<span className="nunu">Pg</span>
            </div>
            <div className="mid_div">
              <div className="home">Home</div>
              <div className="about">About</div>
              <div className="service">Service</div>
              <div className="contact_us">Contact us</div>
            </div>
            {IsAuthenticated || isOwnerAuthenticated ? (
              <>
                <div
                  className="imageProfile"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <UserProfile />

                  <div className="dropdown-content">
                    <p className=""  > <Link  style={{fontSize:"16  px"}} to="/UserDashboard">Profile</Link></p>
                    <hr className="HR" />
                    <p className="logoutuser" onClick={handleLogoutClick}>
                      Log Out
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="login-box">
                <p className="login-text">
                  {" "}
                  <Link
                    style={{
                      textDecoration: "none",
                      color: "white",
                      fontSize: "14px",
                    }}
                    to="/ProviderSeeker"
                  >
                    Login
                  </Link>
                </p>
              </div>
            )}
          </div>
        </header>
        <div
          style={{
            position: "absolute",
            textAlign: "center",
            height: "auto",
            width: "100%",
          }}
        >
          {message && (
            <div style={{ color: "green", fontSize: "20px" }}>
              <p>
                <FlashMessage message={message} />
              </p>
            </div>
          )}
        </div>
        <div
          style={{
            position: "absolute",
            textAlign: "center",
            height: "auto",
            width: "100%",
          }}
        >
          {logoutSuccess && (
            <div style={{ color: "green", fontSize: "20px" }}>
              Successfully logged out!
            </div>
          )}
        </div>
        <div
          style={{
            position: "absolute",
            textAlign: "center",
            height: "auto",
            width: "100%",
          }}
        >
          {logoutStatus && (
            <div style={{ color: "green", fontSize: "20px" }}>
              {logoutStatus}
            </div>
          )}
        </div>

        <div className="body_container">
          <div>
            <div>
              <p>Find Mess Near Your University</p>
            </div>
            <div className="searchbox">
              <input
                type="search"
                id="search"
                placeholder="Enter Location"
                value={searchItem}
                onChange={(e) => setSearchItem(e.target.value)}
              />
              <input type="submit" value="&rarr;" onClick={performSearch} />
              <Link
                style={{
                  textDecoration: "none",
                  color: "white",
                  fontSize: "13px",
                }}
                to="/MessFind"
              >
                Login
              </Link>
            </div>
          </div>
          <div className="image_container">
            <img src="/assets/home.png" alt="logo" />
          </div>
        </div>
      </section>
      <section className="about-section">
        <div className="about-us-container">
          <div className="about-us-text">About us</div>
          <div className="abouttt">
            <div className="about-us">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum
              enim similique aperiam aliquam incidunt sunt cupiditate nihil quo
              blanditiis doloribus, tempora harum, fugit consectetur dolorem
              asperiores? Modi libero perspiciatis magni?
            </div>
            <div className="learn-more">Learn More &rarr;</div>
          </div>
          <div className="about-image">
            <img src="/assets/About_image.png" alt="idk" />
          </div>
        </div>
      </section>

      <section className="last-section">
        <div className="last-section-container">
          <div className="col1">
            <ul>
              <li className="footereasypg">
                Easy <span className="nunu">Pg</span>
              </li>
              <li>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Temporibus nobis sequi expedita possimus vel reprehenderit
                nulla, atque reiciendis ex fugit quod. Dicta, consectetur?
                Tempora sunt delectus aperiam sed soluta atque.
              </li>
            </ul>
          </div>
          <div className="col2">
            <ul>
              <li className="first-item">Company</li>
              <li>Careers</li>
              <li>About Us</li>
              <li>For Partners</li>
              <li>Terms</li>
              <li>Privacy Policy</li>
              <li>Contact Us</li>
            </ul>
          </div>
          <div className="col2">
            <ul>
              <li className="first-item">SUPPORT</li>
              <li>FAQe</li>
              <li>Contact Us</li>
            </ul>
          </div>
          <div className="col2">
            <ul>
              <li className="first-item">QUICK LINK</li>
              <li>Terms</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
          <div className="footer-text">
            copyright 2024 - All Right Reserved by{" "}
            <span className="Easyp-pv-ltd">Easypg.pv.ltd</span>
          </div>
        </div>
      </section>
    </body>
  );
}

export default HomePage;