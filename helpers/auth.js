export default function ensureAuthenticated (req, res, next) {
    if(req.isAuthenticated()) {
        return next ();
    } //? next () execute next middleware 
    req.flash("error_msg","Not Authorized !");
    res.redirect("/users/login");
} 
//? code paste from passport