import express from "express";

import {
    getBookings, 
    getAddBookings, 
    postAddBookings,
    deleteBookings,
    getEditBookings, 
    putEditBookings,
    getRecords,
    getAdminBookings,
    postAdminBookings,
} from "../controllers/BookingsController.js";
import ensureAuthenticated from "../helpers/auth.js";

const router = express.Router();

//router.get("/ideas", getIdeas);
//router.get ("/ideas/add", getAddIdeas);
//router.post("/ideas/add", postAddIdeas);
//router.delete ("/ideas/:id", deleteIdeas);
//router.get("/ideas/edit/:id", getEditIdeas);
//router.put("/ideas/edit/:id", putEditIdeas);

router.get("/", getBookings);
//router.get ("/add", getAddBookings);
//router.post("/add", postAddBookings);
router.route("/add")
    .get(getAddBookings)
    .post(postAddBookings);

router.delete ("/:id", deleteBookings);
//router.get("/edit/:id", getEditIdeas);
//router.put("/edit/:id", putEditIdeas);
router.route("/edit/:id").get(getEditBookings).put(putEditBookings);

router.get("/records",getRecords);
router.route("/admin")
    .get(getAdminBookings)
    .post(postAdminBookings);

export default router;