import express from "express"; //?
import bcrypt from "bcryptjs"; //? decrypt the password to binary 
import User from "../models/User.js"; 
import passport from "passport";
import multer from "multer";
import * as fs from "fs";
import nodemailer from 'nodemailer'; //add by francis

const storageSetting = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,'./uploads');
    },
    filename: (req,file,cb) => {
        cb(null, file.originalname);
    }
});

export const uploadAvatar = multer({
        storage: storageSetting,
        fileFilter: (req,file,cb) => {
            const mimetype = file.mimetype;
            if (mimetype === "image/png" || 
            mimetype === "image/jpg" ||
            mimetype === "image/jpeg" ||
            mimetype === "image/gif"  
            ) {
              cb(null, true)
            } else {
                req.flash("error_msg","Wrong file type for avatar !");
                cb(null, false);
            }
        }
    }).single("avatarUpload");

export const getRegister = (req, res) => {
    res.render("users/register");
};
 
export const postRegister = (req, res) => {
    let errors = [];
    if (!req.body.name) {
        errors.push({ text : "Name is missing !"});    
    }
    if (!req.body.email) {
        errors.push({ text : "Email is missing !"});
    }
    if (req.body.password != req.body.password2) {
        errors.push({ text : "Password is not match !"});
    }
    if (req.body.password.length < 4) {
        errors.push({ text : "Password must be at least 4 characters !"});
    }
    if (errors.length > 0) {
        res.render("users/register", {
            errors : errors, //? -> _error.handlebars
            name : req.body.name,
            email : req.body.email,
            password : req.body.password,
            password2 : req.body.password2,
        });
    } else { //? check the duplicate email address
        User.findOne({ email : req.body.email }).then 
        ((user) => {
            if (user) {
                req.flash("error_msg", "Email already register !");
                res.redirect("/users/register");
            } else {
            //? create user -> user object -> JSON -> mongodb
            const newUser = new User({
                name : req.body.name,
                email : req.body.email,
                password : req.body.password,
            }); //? create salt 
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err; //? err msg to console
                    newUser.password = hash;
                    newUser.save().then(() => { //? save() -> save object to mongodb
                        req.flash("success_msg", "Register Done!");
                        res.redirect("/users/login");
                    }).catch((err) => {
                        console.log(err);
                        req.flash("error_msg", "Server went wrong!");
                        res.redirect("/users/register");
                    }); 
                    });
                });
            }
        });
    }; 
};

export const getLogin = (req, res) => {
    res.render("users/login");
};

export const postLogin = (req, res, next ) => {
    passport.authenticate("local",{
        successRedirect : "/users/profile",
        failureRedirect : "/users/login",
        failureFlash : true,
    })(req,res, next);

    // Add by Francis
    //Sending login confirmation by email
        let mailTransporter = nodemailer.createTransport({
            host: "mail.blogs-website.com",
            port: 465,
            secure: true,
            auth: {
                user: 'francislo@blogs-website.com',
                pass: 'L712o731$'
            }
        })

        let details = {
            from: "francislo@blogs-website.com",
            to: "lofrancis11@gmail.com",
            subject: "Testing Login Confirmation!",
            text: "Thank you for signing up!!"
        }

        mailTransporter.sendMail(details,(err) => {
            if (err) {
                console.log("It has an sending error", err)
            }
            else {
                console.log("Sending email successfully !!")
            }
        })
        // end by Francis
};

export const getLogout = (req, res) => {
    req.logout(err => {
        if(err) throw err;
    });
    req.flash("success_msg", "You are logged out !");
    res.redirect("/");
};

export const getProfile = (req, res) => {
    res.render("users/profile", {
        name : res.locals.user.name,
        email: res.locals.user.email,
        avatar: res.locals.user.avatar,
    })
}

export const postProfile = (req, res) => {
    User.findOne({_id: res.locals.user._id}).then(user => {
        if(req.file) {
            let avatarData = fs.readFileSync(req.file.path).toString("base64");
            let avatarContentType = req.file.mimetpe;
            user.avatar.data = avatarData;
            user.avatar.contentType = avatarContentType;
// disconnect uploaded file
            fs.unlink(req.file.path, (err)=> {
                if (err) throw err;
            });
            user.save().then(() => {
                req.flash("success_msg","avatar uploaded!");
                res.redirect("/users/profile");
            });
        } else {
            req.flash("error_msg", "Choose a correct file before clicking 'Upload Avatar' button");
            res.redirect("/users/profile");
        }
    })
}

export const deleteProfile = (req, res) => {
    User.updateOne({_id: res.locals.user._id},{$unset: {avatar: ""}}).then(() => {
        req.flash("success_msg", "Delete Avatar successfully!");
        res.redirect("/users/profile");
    }
   )
};