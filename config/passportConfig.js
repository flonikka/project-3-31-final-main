import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

export default function (passport) {
    passport.use(new LocalStrategy( //? app.use 
        {usernameField : "email"},
        function (email, password, done) { //? check email & password , done() -> return  
            User.findOne ({
                email : email,
            }).then(user => {
                if(! user) {
                    return done(null, false, {type : "fail_passport", message : "No User Found !"}); 
                    //? return done(null, user);
                } else {
                    bcrypt.compare(password, user.password, (err, isMatch) => { //? compare match or not password in mongodb 
                        if (err) throw err;
                        if (isMatch) {
                            return done (null, user);
                        } else {
                            return done (null, false, { 
                                type: "fail_password",
                                message : "Password Incorrect !", 
                            });
                        }
                    });
                }
            });
         }

    ));

passport.serializeUser(function (user, done){ //? user.id be serializeUser
    done(null, user.id);
});

passport.deserializeUser(function (id, done){
    User.findById(id, function(err, user) {
        done(err, user);
    });
}); 
}