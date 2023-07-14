import Contact from "../models/Contact.js";

export const getContact =function(req, res){
    res.render("contacts/contact.handlebars");
};

export const postContact = function(req, res){
    let errors = [];
    if(!req.body.name) {
        errors.push({text:"Please enter your name"});
    }
    if(!req.body.email){
        errors.push({text:"Please enter your email"});
    }  
    if(!req.body.phone) {
        errors.push({text:"Please enter your phone number"});
    }
    if(!req.body.subject){
        errors.push({text:"Please enter your subject"});
    }  
    if(!req.body.message){
        errors.push({text:"Please enter your message"});
    }  
    if (errors.length > 0){
        res.render("contacts/contact",{
            errors :errors,
            name :req.body.name,
            email :req.body.email,
            phone :req.body.phone,
            subject :req.body.subject,
            message :req.body.message,
        });
    }else{
        const newContact ={
            name :req.body.name,
            email :req.body.email,
            phone :req.body.phone,
            subject :req.body.subject,
            message :req.body.message,
        };
        new Contact(newContact).save().then(() =>{
            req.flash("success_msg", "Your inquiry has been submitted. We will get back to you soon!");
            res.redirect("/contacts/contact");
        });
    };
};