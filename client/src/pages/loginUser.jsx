import React from 'react';
import "../designs/loginForUser.css";
import "../designs/util.css"

function LoginUser() {
    return (

        <body id="container">
            <div class="main">
                <div class="content">
                    <div style="position: absolute;"> <div class="loginTitle">Log in</div>
                        <div class="welcome">
                            <div class="upper">Welcome to</div> <span class="lower1">Easy</span><span class="lower2">Pg</span>
                        </div></div>
                    <form class="formC" action="" method="post">
                        <div class="parentforum">
                            <div class="mainforum">
                                <input class="emailText" type="text" name="email" placeholder="Email" autocomplete="off" />
                                <div class="password-container">
                                    <input type="password" id="password" name="password" class="passwordText" placeholder="Password" autocomplete="off" />

                                    <img id="eye" src="closeEye.png" alt="Eye Icon" onclick="togglePassword()" />

                                </div>
                                <button class="loginSubmit" type="submit">Log in</button>
                                <br />
                                <div class="or">Or</div>
                                <br />
                                <div class="parentSignupGoogle">
                                    <div class="signupGoogle"><img class="googleimg" src="google.png" alt="" srcset="" />
                                        <div class="signupwithgoogleText">Sign up with Google Account</div>
                                    </div>
                                </div>
                                <br />
                                <div class="parentnotAccount"> <div class="notAccount">Don't have any EasyPg account?<a class="whoareyou" id="signupLink" href="./signupUser"> Sign Up</a> </div></div>


                            </div>
                        </div>


                    </form>


                </div>
                <div class="findNearestMess">
                    <div class="parent-img">
                        <img class="ellipse" src="Ellipse.png" alt="" srcset="" />
                    </div>
                    <div class="parent-elipse">
                        <div class="FindyourNearestMess">Find your
                            Nearest Mess</div>

                    </div>
                    <div class="parent-column">
                        <div class="col1"></div>
                        <div class="col2"></div>
                        <div class="col3"></div></div>

                </div>



                </div>
        </body>

    )
}

export default LoginUser;
