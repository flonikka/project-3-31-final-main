import mongoose from "mongoose";
const {Schema} = mongoose;

const BookingSchema = new Schema ({
    facility: {
        type : String,
        required: true,

    },
    session : {
        type : String,
        required: false,
    },
    userID : {
        type : mongoose.Types.ObjectId,
        /* required : true,  */
    },    
    bookingDate : {
        type : Date,
        required: true,
    },
    remarks : {
        type : String,
        required: false,

    },
    userEmail : {
        type : String,
        required: false,

    },

});

const Booking = mongoose.model("Bookings",BookingSchema);
// based on IdeaSchema, create a mold Idea 
export default Booking;