import React from 'react';
import {Link} from 'react-router-dom';
import { useEffect } from 'react';
import '../designs/landing-page.css'

function LandingPage() {
  useEffect(()=>{
    document.title="Our promises to grow your business fast";
  },[]);
  return (
    
    <body className='bodyx' >
   
    <div className="r1">
         <div className="col-m"></div>
         <div className="main-content">
            <div className="upper-margin"></div>
            <div className="main-title"><span className="font easy">Easy</span><span className="font easy-2">Pg</span></div>
            <div className="business-plan">
                <div className="main-talk">
                    <div className="weight line-1">Growing your business</div>
                    <div className="weight line-2">has became even easier,</div>
                    <div className="line-3">Only for you.</div>
                    <div className="brand"><span className="font easy">Easy</span><span className="font easy-2">Pg</span></div>
                    <button type="button" className="join"><a className="log-mess" href="./LoginOwner"><Link style={{textDecoration:"none",color:"white"}} to="/LoginOwner" >Join Us Today</Link></a></button>
                </div>

            </div>
         </div>

    </div>
    

    <div className="r2">
        <div className="col-m"></div>
        <div className="main-content-2">
            <div className="upper-margin-2"></div>
            <div className="main-text">
                <div className="weight line-4">Explore the world of <span className=" easy">Easy</span><span className=" easy-2">Pg</span>! </div>
                <div className="line-5">We will always provide you transparent policies and easy payments, for your growth!</div>
            </div>
            <div className="main-picture">
               <div className="first">
                <div className="picture"><img src="./assets/young-handsome-business-man-with-laptop-office 1.png" alt="" srcset=""/></div>
                <div className="text1">
                    <div className="weight title-text1">Sign Up Process</div><div className="text-left">Click the Join us button for signing up in 30 seconds</div></div></div>
               <div className="first">
                <div className="picture"><img src="./assets/portrait-young-indian-top-manager-t-shirt-tie-crossed-arms-smiling-white-isolated-wall 1.png" alt="" srcset=""/></div>
               <div className="text1">
                    <div className="weight title-text1">Privacy Policy</div><div className="text-left">Read the privacy policy terms for better understanding</div>
               </div></div>


        </div>
    </div>
    </div>
    <div className="r3">
        <div className="col-m"></div>
        <div className="main-content-3">
            <div className="upper-margin-3"></div>
            <div className="main-text-2">
                <div className="weight line6">Why join <span className=" easy">Easy</span><span className=" easy-2">Pg</span>?</div>
                <div className="line7">The advanced tools of <span className=" easy">Easy</span><span className=" easy-2">Pg</span> will bring more benefits to your business.</div>
            </div>
            <div className="main-picture">
                <div className="first new-border">
                 <div className="picture"><img src="/assets/businessman-black-suit-makes-thumbs-up 1.png" alt="" srcset=""/></div>
                 <div className="text1">
                     <div className="weight title-text1">Sign Up Process</div><div className="text-left">Click the Join us button for signing up in 30 seconds</div></div></div>
                <div className="first new-border">
                 <div className="picture"><img src="/assets/outdoor-businessman-having-his-arms-crossed (1) 1.png" alt="" srcset=""/></div>
                <div className="text1">
                     <div className="weight title-text1">Privacy Policy</div><div className="text-left">Read the privacy policy terms for better understanding</div>
                </div></div>
 
 
         </div>

        </div>
    </div>
    <div className="r4">
        <div className="col-m"></div>
        <div className="main-content-4">
            <div className="upper-margin-4"></div>
            <div className=" main-text-3">
                <div className="weight line8">Connect with us!</div> 
            </div>
            <div className="main-mob-no">
                <input className="mob" type="text" name="mobile-no" id="" placeholder="Mobile No"/>
                <button className="mob-submit" type="submit" >Submit</button>
            </div>

        </div>
    </div>
    <div className="last-section">
        <div className="col-m"></div>

        <div className="last-section-container">
          <div className="col1">
            <ul>
              <li className="footereasypg">Easy <span className="nunu">Pg</span></li>
              <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Temporibus nobis sequi expedita possimus vel
                reprehenderit nulla, atque reiciendis ex fugit quod. Dicta, consectetur? Tempora sunt delectus aperiam sed
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
    </div>
    
    
</body>
  )
}

export default LandingPage