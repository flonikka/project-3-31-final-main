import express from "express";
import {engine} from "express-handlebars";
import morgan from "morgan"; //? nodemon message

//* load flash & express-session
import flash from "connect-flash";
import session from "express-session";
//* load dotenv -> import before PORT
import dotenv from "dotenv";
    dotenv.config();
    console.log(process.env.PORT);
    console.log(process.env.mongoURI);

//* load body-parser 
import bodyParser from "body-parser"; //? get API - user input variable (e.g numeric)
//* load mongoose 
import mongoose from "mongoose"; //? node driver
//* load method override
import methodOverride from "method-override"; //? creat, delete variable 

const app = express();
const PORT = process.env.PORT || 3100;//? change from dotenv setting 

mongoose.set('strictQuery', false);
const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.mongoURI);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    }catch (error) {
        console.log(error);
        process.exit(1);
    }
}
//? promise 
// mongoose
//     .connect(process.env.mongoURI)
//     .then(() => console.log("Mongodb connected.."))
//     .catch((err) => console.log(err));


//* Refactoring Step 5 **change to..
import usersRoute from "./routes/usersRoute.js";
//* ADD  ***NEW API
import bookingsRoute from "./routes/bookingsRoute.js";
import contactsRoute from "./routes/contactsRoute.js";
import adminRoute from "./routes/adminRoute.js";
//*
import passport from "passport";
import passportConfig from "./config/passportConfig.js";
import ensureAuthenticated from "./helpers/auth.js";
passportConfig(passport); //? import verify if user login 

//! setup handlebars template engine middleware - (API)
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");
//*
app.use(morgan("tiny"));
app.use(express.static("views/public"));
app.use(bodyParser.urlencoded({extended: false}));//? debug message  
app.use(bodyParser.json()); //? decide conversion format 
app.use(methodOverride("_method")); //? run delete function 
//* session & flash use after bodyParser
app.use(
    session({ //? create sid.signature :{__}
        secret: "anything", //? hash func. (e.g. generate random id by func.)
        resave: true, 
        saveUninitialized: true, //? auth user's tokens 
        //cookie : { maxAge : 15 * 10000 }, //? set time duration e.g auto-logout 150 * 1000
        //genid: function ()
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
//* set @ main.handlebars
app.use(function(req,res, next){
    res.locals.success_msg = req.flash("success_msg"); //? locals.__ is a global variable 
    res.locals.error_msg = req.flash("error_msg");
    res.locals.fail_passport = req.flash("fail_passport"); //? pass passportConfig err message
    res.locals.user = req.user || null;

    //* Add *** NEW
     if (req.user)  {
    // console.log("req.user.admin => ",req.user.admin);
    if (req.user.admin == true) {
        res.locals.admin = true;
    }
    else {
        res.locals.admin = false;
    };
    console.log("user ==> ",res.locals.user);
    };
    //console.log("=== login user ===", res.locals.user);
    next(); //? initialize flash() 
});

//! handlebars middleware template engine - (API)
//* middleware (run as single thread) -> top-to-bottom as priority
app.get("/", (req,res) => {
    console.log(req.session.cookie.maxAge / 1000); //?
    //console.log(req.seesion.genid());
    res.render("index",{title : "Welcome !"});
});
//* Before refactoring
app.get("/about", (req,res) => {
    res.render("about");
});

//! middleware 
//* from refactoring Step 5 
app.use("/users", usersRoute);//? main route 
//* ADD *** API use
app.use("/bookings", ensureAuthenticated, bookingsRoute);
app.use("/contacts", contactsRoute);
app.use("/admin", adminRoute);
//*
app.use(function(req,res, next){
    console.log("Time", Date.now());
    next(); 
});
//* ADD *** NEW page
app.get("/facilities", (req,res) => {
    res.render("facilities");
});
app.get("/golf", (req,res) => {
    res.render("golf");
});
app.get("/rugby", (req,res) => {
    res.render("rugby");
});
app.get("/squash", (req,res) => {
    res.render("squash");
});
app.get("/tabletennis", (req,res) => {
    res.render("tabletennis");
});
app.get("/tennis", (req,res) => {
    res.render("tennis");
});
app.get("/receipt", (req,res) => {
    res.render("receipt");
});
//* 

app.get("*", (req, res) => {
    res.status(404); 
    //? can be add message ".send("")" 
    //*res.status(404).send("WTF");
    res.render("404");
}); //* 404 

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
})
});
