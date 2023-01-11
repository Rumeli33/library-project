//middleware function
const isLoggedIn = (req, res, next) => {
    if( req.session.currentUser ){
      console.log("user logged in");
        next(); // keep calling the next middleware
    } else {
        // send the user to the login page
  
        res.render('auth/login',{ errorMessage: 'Please login to continue'});
    }
  }

  module.exports = isLoggedIn;