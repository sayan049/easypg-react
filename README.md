# easypg-react
 app.get("/auth/google/callback", (req, res, next) => {
    passport.authenticate("google", (err, user, info) => {
      if (err) {
        console.error("Authentication Error:", err.message);
        return res.redirect(`${ORIGIN}/ProviderSeeker?error=auth_failed`);
      }
  
      if (!user) {
        console.error("No user returned from Google OAuth");
        return res.redirect(`${ORIGIN}/ProviderSeeker?error=auth_failed`);
      }
  
      // Log in the user
      req.logIn(user, (loginErr) => {
        if (loginErr) {
          console.error("Login Error:", loginErr.message);
          return res.redirect(`${ORIGIN}/ProviderSeeker?error=login_failed`);
        }
  
        // Successful authentication, redirect to home page
        return res.redirect(`${ORIGIN}`);
      });
    })(req, res, next);
  });