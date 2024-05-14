import React from "react";
import "../designs/style.css"

function HomePage() {
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
            <div className="login-box">
              <p className="login-text">
                {/* <a style="text-decoration: none;" href="./provider">
                    Login
                  </a> */}
                <a style={{ textDecoration: "none" }} href="./provider">
                  Login
                </a>
              </p>
            </div>
          </div>
        </header>
        <div className="body_container">
          <div>
            <div>
              <p>Find Mess Near Your University</p>
            </div>
            <div className="searchbox">
              <input type="search" id="search" placeholder="Enter Location" />
              <input type="submit" value="&rarr;" onclick="performSearch()" />
            </div>
            {/* <script>
          function performSearch() {
            var searchItem = document.getElementById("search").value;
            alert("Searching for: " + searchItem);
          }
        </script> */}
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
