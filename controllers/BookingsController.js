import Booking from "../models/booking.js";

export const getBookings = (req, res) => {
   //    console.log("user id", res.locals.user._id);
        Booking.find({userID: res.locals.user._id})
            .lean()
            .sort({bookingDate: 1, session : 1})
            .then(bookings => {
                console.log(bookings);
                bookings.forEach(bookingsFormat)
                
                function bookingsFormat (booking, index) {
                    console.log("-----???^^^",booking);
                    booking.bookingDate = booking.bookingDate.toDateString();
                    booking.session_desc = session_arr[Number(booking.session) - 1];
                    
                    booking.img_path = facility_img(booking.facility);
                    booking.facility = facility_name(booking.facility);
                    console.log("img path", booking.img_path);
                    console.log("???^^^-----",booking);
                }
                //go to template "ideasIndex" with table ideas
                res.locals.bookings = bookings;
                console.log("bookings????????^^^^^^^^ ",bookings);
                res.render("bookings/bookingsIndex",{bookings: bookings});
            });
    }
       
    export const getAddBookings = (req, res) => {
    //    console.log("before render bookings/add");
        res.render("bookings/add");
    }
    let session_arr = [
        "10:00 - 11:00",
        "11:00 - 12:00",
        "12:00 - 13:00",
        "13:00 - 14:00",
        "14:00 - 15:00",
        "15:00 - 16:00",
        "16:00 - 17:00",
        "17:00 - 18:00",
        "18:00 - 19:00",
    ];

    let fac_arr = [
    {facCode: "GF01", fac :"Golf", facImgpath: "./img/5.png" },    
    {facCode: "RB01", fac :"Rugby", facImgpath: "./img/4.png" },
    {facCode: "SQ01", fac :"Squash Court 1", facImgpath: "./img/2.png"},
    {facCode: "SQ02", fac :"Squash Court 2", facImgpath: "./img/2.png"},
    {facCode: "SQ03", fac :"Squash Court 3", facImgpath: "./img/2.png"},
    {facCode: "SQ04", fac :"Squash Court 4", facImgpath: "./img/2.png"},
    {facCode: "TS01", fac :"Tennis Court 1", facImgpath: "./img/1.png"},
    {facCode: "TS02", fac :"Tennis Court 2", facImgpath: "./img/1.png"},
    {facCode: "TS03", fac :"Tennis Court 3", facImgpath: "./img/1.png"},   
    {facCode: "TS04", fac :"Tennis Court 4", facImgpath: "./img/1.png"},
    {facCode: "TS05", fac :"Tennis Court 5", facImgpath: "./img/1.png"},   
    {facCode: "TS06", fac :"Tennis Court 6", facImgpath: "./img/1.png"},
    {facCode: "TS07", fac :"Tennis Court 7", facImgpath: "./img/1.png"},     
    {facCode: "TT01", fac :"Table Tennis Court 1", facImgpath: "./img/3.png"},
    {facCode: "TT02", fac :"Table Tennis Court 2", facImgpath: "./img/3.png"},            
    {facCode: "TT03", fac :"Table Tennis Court 3", facImgpath: "./img/3.png"},
    {facCode: "TT04", fac :"Table Tennis Court 4", facImgpath: "./img/3.png"},       
    ];

    function facility_name (in_fac) {
        let obj = fac_arr.find(o => o.facCode === in_fac);
        return obj.fac;
    };

    function facility_img (in_fac) {
        let obj = fac_arr.find(o => o.facCode === in_fac);
        return obj.facImgpath;
    };

    export const postAddBookings = (req, res) => {
        //* Add *** New function
        let bookingRemarks ="";

    console.log("admin :",res.locals.admin);
    console.log("action :",req.body.action);
    console.log("session selected: ",req.body.session_selected);
    console.log("facility :", req.body.facility);
    if (res.locals.admin) {
        bookingRemarks = "admin booking"
    } else {
        bookingRemarks = "client booking";
    };
    //* 

    let errors = [];
    if (!req.body.facility) {
//        console.log("Please add a facility");
        errors.push({text: "Please add a facility"});
    }
    if (!req.body.bookingDate) {
//        console.log("Please add a date");
        errors.push({text: "Please add a date"});
    }
    //* disable
//     if (!req.body.session) {
//         console.log("Please add a session");
//         errors.push({text: "Please add a session"});
//     }

    let today = new Date();
    let inputBookingDate = new Date (req.body.bookingDate);
    inputBookingDate.setDate(inputBookingDate.getDate());
        if (inputBookingDate < today) {
    errors.push({text: "An error in booking Date and Time. Please review."});
    }
    if (errors.length > 0) {
        res.render("bookings/add", {
            errors : errors,
            facility : req.body.facility,
            bookingDate : req.body.bookingDate,
            session : req.body.session,
        });
    }
    //*add *** NEW
    else if (req.body.action == "addBooking")
    {
    console.log("facility : ", req.body.facility);
    console.log("booking date : ", req.body.bookingDate);
    console.log("session : ", req.body.session_selected);
    //*    
    

    Booking.findOne ({facility : req.body.facility_selected,    
        bookingDate : req.body.bookingDate, 
        session : req.body.session_selected},function(err, result) {
            if (err) throw err;
            console.log ("findOne *** ", result);
            if (result !== null)
             {errors.push({text: "Session already booked"});
                res.render("bookings/add", {
                errors : errors,
                facility : res.locals.facility,
                bookingDate : req.body.bookingDate,
                session_selected : req.body.session_selected,  
                });
             }
            else
                {
                console.log("$$$$ bookingRemarks", bookingRemarks);
                const newBooking = {
                    facility : req.body.facility_selected,
                    bookingDate : req.body.bookingDate,
                    session : req.body.session_selected,
                    userID : res.locals.user._id,
                    remarks : bookingRemarks,
                    userEmail : res.locals.user.email};
                new Booking(newBooking).save().then(() => {
                    req.flash("success_msg", "Booking Added!");
                    res.redirect("/bookings");
                    });
                };
            });
    
//    console.log("errors =>", errors);
    //* Add ***NEW        
    } else {
        Booking.find({facility : req.body.facility,    
            bookingDate : req.body.bookingDate, 
            },{_id:0,session:1})
        .lean()
        .sort({bookingDate: 1, session: 1})
        .then(booked_sessions => {

            booked_sessions.forEach(simplify);

            function simplify(item, index, arr) {
            arr [index] = Number(item.session);
            } 
            console.log("simplified booked session",booked_sessions);
            
            let sessions = [];
            let booked_status = "";
            let buttonDisabled = "";
            for (let i = 1; i < 10; i++) 
            { 
            if (booked_sessions.includes(i))
                {booked_status = "booked";
                buttonDisabled = "disabled";}
            else{
                booked_status = "available"
                buttonDisabled = "";
            };
            let facName = facility_name(req.body.facility);
            console.log("session req.body.facility=> ", req.body.facility);
            sessions[i] = {
                facility: req.body.facility,
                fac_name: facName, 
                bookingDate:req.body.bookingDate, 
                session: i,
                session_desc : session_arr[i-1],
                status : booked_status,
                disabled : buttonDisabled,
               };
          
            };
            res.locals.facility_selected = req.body.facility;
            res.locals.bookingDate = req.body.bookingDate;
            console.log("res.locals.facility selected ---> ", res.locals.facility_selected);
            res.render("bookings/add",{
                errors : errors,
                facility : req.body.facility,
                bookingDate : res.locals.bookingDate,
                session : req.body.session,
                sessions: sessions,
                facility_selected :res.locals.facility_selected
            });
            });
            
                };
            }
//*    
export const deleteBookings = (req,res) => {
    Booking.deleteOne ({ _id: req.params.id})
    .then(() => {
        req.flash("error_msg", "Booking Deleted !");
        res.redirect("/bookings")});
}

export const getEditBookings = (req,res) => {
    Booking.findOne ({ _id : req.params.id})
        .lean()
        .then((booking) => {
            booking.facility_nm = facility_name (booking.facility);
            booking.session_desc = session_arr[Number(booking.session) - 1];
            booking.bookingDate = booking.bookingDate.toDateString();
            console.log(">>>booking facility", booking.facility);
            console.log(">>>booking facility name", booking.facility_nm);
            console.log(">>>booking ", booking);
            res.render("bookings/edit", {booking: booking});
});
}

//* ADD *** NEW
export const putEditBookings= (req, res) => {
    let errors = [];
    let save_booking_id = [];
    save_booking_id.push(req.params.id);
    console.log(save_booking_id); 

    if (!req.body.facility) {
        errors.push({text: "Please add a facility"});
    }
    if (!req.body.bookingDate) {
        errors.push({text: "Please add a date"});
    }
    if (!req.body.session) {
        errors.push({text: "Please add a session"});
    }
    if (errors.length > 0) {
        res.render("bookings/edit", {
            errors : errors,
            facility : req.body.facility,
            bookingDate : req.body.bookingDate,
            session : req.body.session,
        });
    }
    else
    {
    console.log("facility ", req.body.facility);
    console.log("booking date ", req.body.bookingDate);
    console.log("session ", req.body.session);

        let bookingRemarks = '';
    if (res.locals.admin) {
        bookingRemarks = "Admin booking"
    } else {
        bookingRemarks = "Client booking";
    };


    Booking.findOne ({facility : req.body.facility,    
        bookingDate : req.body.bookingDate, 
        session : req.body.session},function(err, result) {
            if (err) throw err;
            console.log (result);
            if (result !== null)
             {    
                errors.push({text: "Session already booked"});
                res.render("bookings/edit", {
                errors : errors,
                facility : req.body.facility,
                bookingDate : req.body.bookingDate,
                session : req.body.session,  
                });
             }
            else
                {
                    console.log("saved_booking_id ",save_booking_id);
                    Booking.findOne({ _id: save_booking_id})
                    .then(booking => {
                        console.log(booking);
                        booking.facility = req.body.facility;
                        booking.bookingDate = req.body.bookingDate;
                        booking.session = req.body.session;
                        booking.remarks = "Client booking";
                        booking.userEmail = res.locals.user.email;  
                        booking.save().
                        then(()=> {
                        req.flash("success_msg", "Booking updated !");
                        res.redirect('/bookings');    
                        });

                    });
                };
        });
    }
}

export const getRecords = (req, res) => {
    Booking.aggregate (
        [
            {
              '$lookup': {
                'from': 'users', 
                'localField': 'userEmail', 
                'foreignField': 'email', 
                'as': 'result'
              }
            }, {
              '$unwind': {
                'path': '$result', 
                'preserveNullAndEmptyArrays': true
              }
            }
          ])
        .then(records => {
        console.log("All booking records", records);
        res.render("bookings/records",{records: records})
    }); 
}

export const getAdminBookings = (req, res) => {
res.render("bookings/admin");
}

export const postAdminBookings = (req, res) => {
let i = 0;
console.log(req.body.facility);
const date1 = new Date(req.body.maintStart);
const date2 = new Date(req.body.maintEnd);
do 
{ 
    console.log(date1, " - ", date2);
    i =  0;
    for (let i = 1; i <= 9; i++) {
        console.log(req.body.facility, " ", i, " ", date1);
        const newBooking = {
            facility : req.body.facility,
            bookingDate : date1.setDate(date1.getDate()),
            session : i,
            userID : res.locals.user._id,
            remarks : "Maintenance",
            userEmail : res.locals.user.email,};
            new Booking(newBooking).save().then(() => {
            
            });
    }       
    date1.setDate(date1.getDate()+1);
}
while (date1 <= date2 & i < 10);
//    console.log(req.body.maintStart);
//    console.log(req.body.maintStart.setDate(req.body.maintStart.getDate() + 1));
//    console.log(req.body.maintEnd);
req.flash("success_msg", "Maintenance Bookings Added!");
res.redirect("/bookings/admin");
}
//*


//* putEditBookgins function original
// Booking.findOne({
//     _id: req.params.id,
// }).then(booking => {
//     let edit_error_msg = "";
//     if (!req.body.facility) {
//         edit_error_msg += "please add a facility." ;
//     }
//     if (!req.body.bookingDate) {
//         edit_error_msg += "please add a date.";
//     }
//     if (!req.body.session) {
//         edit_error_msg += "please add a session.";
//     }

//     if (edit_error_msg) {
//         req.flash("error_msg", edit_error_msg);
//         res.redirect("/bookings/edit/"+booking._id);
//     } else
//     {

//     booking.facility = req.body.facility;
//     booking.bookingDate = req.body.bookingDate;
//     booking.session = req.body.session;
//     booking.save().then(()=> {
//         req.flash("success_msg", "Booking updated !");
//         res.redirect('/bookings');
//     });
//     }
// });