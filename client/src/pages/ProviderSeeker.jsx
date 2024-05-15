import React from "react";
import { Link } from "react-router-dom";
import "../designs/provider-seeker-page.css";
import "../designs/footerstyle.css";


function ProviderSeeker() {
    return(
        
        <body>
    <div className="main-container">
        <div className="left-container">
            <h2>Sign Up</h2>
            <h3>Who are you ?</h3>
            <button id="seeker"> <a className="seekera" href="./loginUser">  <Link style={{textDecoration:"none",color:"white"}} to="/LoginUser">Mess Seeker</Link></a></button>
            <button id="provider"> <a className="seekera p" href="./landing-page">Mess Owner</a></button>
        </div>
        <div className="right-container">
            <img src="./assets/house-design.png" alt="sweet-home"/>
        </div>
    </div>

    <section className="last-section">
        <div className="last-section-container">
            <div className="col1">
                <ul>
                    <li className="footereasypg">Easy <span>Pg</span></li>
                    <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Temporibus nobis sequi expedita
                        possimus vel
                        reprehenderit nulla, atque reiciendis ex fugit quod. Dicta, consectetur? Tempora sunt delectus
                        aperiam sed
                        soluta atque.</li>
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
                copyright 2024 - All Right Reserved by <span className="Easyp-pv-ltd">Easypg.pv.ltd
                </span>
            </div>
        </div>
    </section>
</body>


    );

}

export default ProviderSeeker;