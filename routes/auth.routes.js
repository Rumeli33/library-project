const bcryptjs = require("bcryptjs");
const User = require("../models/User.model");
const router = require("express").Router();

const saltRounds = 10;
// SIGN UP: Route to display sign up form 

router.get("/signup",(req,res,next) =>{
    res.render("auth/signup");
});


// SIGN UP : process form

router.post("/signup",(req,res,next) => {
   const {email,password} = req.body;

   bcryptjs
   .genSalt(saltRounds)
   .then(salt => {
    return bcryptjs.hash(password,salt)
   })
   .then((hash) =>{
    const userDetails = {
        email,
        passwordHash: hash
    }
    
    return User.create(userDetails);
   })
   .then(userFromDB => {
    res.redirect("/");
   })
   .catch(e => {
    console.log("error creating user acccount", e)
    next(e);
   });
});

// LOGIN : Display form

router.get('/login',(req,res,next) =>{
res.render("auth/login");
});

//LOGIN : PROCESS form
router.post("/login", (req,res,next) =>{
    const {email, password} = req.body;

    if(!email || !password) {
        res.render('auth/login',{ errorMessage: 'please fill both email and password to login'});
        return;
    }

User.findOne({email:email})
    .then( userFromDB =>{
        if(!userFromDB){
            //user does not exist
            res.render('auth/login',{ errorMessage: 'Email is not registered. try again'});
            return;
        } else if (bcryptjs.compareSync(password,userFromDB.passwordHash)) {
            //login successful
            req.session.currentUser = userFromDB;
            res.redirect("/user-profile");
          
        } else {
            //login failed
            res.render('auth/login',{errorMessage: 'incorrect credentials'});
        }
    })
.catch(error =>{
    console.log("Error trying to login", error)
    next(error);
});

});
// Get ROute for User-profile page
router.get('/user-profile',(req, res) => {

   res.render('users/user-profile',{userInSession: req.session.currentUser});
});

//LOGOUT
router.post('/logout', (req, res, next) => {
    req.session.destroy(err => {
        if (err) next(err);
        res.redirect('/');
    });
});


module.exports = router;