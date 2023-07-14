import express from "express";

import {
    getContact, 
    postContact,
} from "../controllers/ContactsController.js";
import ensureAuthenticated from "../helpers/auth.js";

const router = express.Router();

router.route("/contact")
    .get(getContact)
    .post(postContact);

export default router;