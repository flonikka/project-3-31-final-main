import Contact from "../models/Contact.js";
import nodemailer from 'nodemailer'; //by francis
import { info } from "console"; //Add by Francis

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
        
            // Add by Francis
            console.log(req.body)
            const output =`
            <p>You have a new contact request!</p>
            <h3>Contact Details:</h3>
            <ul>
            <li>Name: ${req.body.name}</li>
            <li>Email: ${req.body.email}</li>
            <li>Phone: ${req.body.phone}</li>
            <li>Subject: ${req.body.subject}</li>
            </ul>
            <h3>Message</h3>
            <p>${req.body.message}</p>
            `;
            // Create reusable transporter object using the default SMTP transport
            const transporter = nodemailer.createTransport({
                host: "mail.blogs-website.com",
                port: 465,
                secure: true,
                auth: {
                    user: 'francislo@blogs-website.com',
                    pass: '******'
                },
                // tls:{
                //     rejectUnauthorized: false
                // }
            });
            const mailOptions ={
                from: '"Francis Lo 👻" <francislo@blogs-website.com>', // sender address
                to: "flonikka@gmail.com", // list of receivers
                subject: "Contact Inquiry ✔", // Subject line
                text: "Response by Francis", // plain text body
                html: output // html body
            };
            // Send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) =>{
                if(error){
                    console.log(error);
                }
                console.log("Message sent: %s", info.messageId);
                console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                // res.render('/contacts/contact', {msg: 'Email has been sent'});
            })
            
            });
        req.flash("success_msg", "Your inquiry has been submitted. We will get back to you soon!");
        res.redirect("/contacts/contact");
        };
};



    
