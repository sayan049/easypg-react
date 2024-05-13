import React from "react";
function HomePage() {
  return (
    <body>
      <section class="first-section">
        <header>
          <div class="Container">
            <div class="easypg">
              Easy<span class="nunu">Pg</span>
            </div>
            <div class="mid_div">
              <div class="home">Home</div>
              <div class="about">About</div>
              <div class="service">Service</div>
              <div class="contact_us">Contact us</div>
            </div>
            <div class="login-box">
              <p class="login-text">
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
        <div class="body_container">
          <div>
            <div>
              <p>Find Mess Near Your University</p>
            </div>
            <div class="searchbox">
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
          <div class="image_container">
            <img src="/assets/home.png" alt="logo" />
          </div>
        </div>
      </section>
      <section class="about-section">
        <div class="about-us-container">
          <div class="about-us-text">About us</div>
          <div class="abouttt">
            <div class="about-us">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum
              enim similique aperiam aliquam incidunt sunt cupiditate nihil quo
              blanditiis doloribus, tempora harum, fugit consectetur dolorem
              asperiores? Modi libero perspiciatis magni?
            </div>
            <div class="learn-more">Learn More &rarr;</div>
          </div>
          <div class="about-image">
            <img src="/assets/About_image.png" alt="idk" />
          </div>
        </div>
      </section>

      <section class="last-section">
        <div class="last-section-container">
          <div class="col1">
            <ul>
              <li class="footereasypg">
                Easy <span class="nunu">Pg</span>
              </li>
              <li>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Temporibus nobis sequi expedita possimus vel reprehenderit
                nulla, atque reiciendis ex fugit quod. Dicta, consectetur?
                Tempora sunt delectus aperiam sed soluta atque.
              </li>
            </ul>
          </div>
          <div class="col2">
            <ul>
              <li class="first-item">Company</li>
              <li>Careers</li>
              <li>About Us</li>
              <li>For Partners</li>
              <li>Terms</li>
              <li>Privacy Policy</li>
              <li>Contact Us</li>
            </ul>
          </div>
          <div class="col2">
            <ul>
              <li class="first-item">SUPPORT</li>
              <li>FAQe</li>
              <li>Contact Us</li>
            </ul>
          </div>
          <div class="col2">
            <ul>
              <li class="first-item">QUICK LINK</li>
              <li>Terms</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
          <div class="footer-text">
            copyright 2024 - All Right Reserved by{" "}
            <span class="Easyp-pv-ltd">Easypg.pv.ltd</span>
          </div>
        </div>
      </section>
    </body>
  );
}

export default HomePage;
