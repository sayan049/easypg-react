import React from 'react';
import "../designs/loginForUser.css";
import "../designs/util.css"

function LoginUser() {
    return (

        <body id="container">
            <div className="main">
                <div className="content">
                    <div className='hh'> <div className="loginTitle">Log in</div>
                        <div className="welcome">
                            <div className="upper">Welcome to</div> <span className="lower1">Easy</span><span className="lower2">Pg</span>
                        </div></div>
                    <form className="formC" action="" method="post">
                        <div className="parentforum">
                            <div className="mainforum">
                                <input className="emailText" type="text" name="email" placeholder="Email" autocomplete="off" />
                                <div className="password-container">
                                    <input type="password" id="password" name="password" className="passwordText" placeholder="Password" autocomplete="off" />

                                    <img id="eye" src="closeEye.png" alt="Eye Icon" onclick="togglePassword()" />

                                </div>
                                <button className="loginSubmit" type="submit">Log in</button>
                                <br />
                                <div className="or">Or</div>
                                <br />
                                <div className="parentSignupGoogle">
                                    <div className="signupGoogle"><img className="googleimg" src="google.png" alt="" srcset="" />
                                        <div className="signupwithgoogleText">Sign up with Google Account</div>
                                    </div>
                                </div>
                                <br />
                                <div className="parentnotAccount"> <div className="notAccount">Don't have any EasyPg account?<a className="whoareyou" id="signupLink" href="./signupUser"> Sign Up</a> </div></div>


                            </div>
                        </div>


                    </form>


                </div>
                <div className="findNearestMess">
                    <div className="parent-img">
                        <img className="ellipseeep" src="Ellipse.png" alt="" srcset="" />
                    </div>
                    <div className="parent-elipse">
                        <div className="FindyourNearestMess">Find your
                            Nearest Mess</div>

                    </div>
                    <div className="parent-column">
                        <div className="col1L"></div>
                        <div className="col2L"></div>
                        <div className="col3L"></div></div>

                </div>



                </div>
        </body>

    )
}

export default LoginUser;
