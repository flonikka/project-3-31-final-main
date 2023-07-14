import express from "express";

import {
    getRecords,
    getInquiries,
    // getAdmin,
    // postAdmin,
} from "../controllers/AdminController.js";
import ensureAuthenticated from "../helpers/auth.js";

const router = express.Router();

router.get("/records",getRecords);
router.get("/inquiries",getInquiries);

// router.route("/admin")
//     .get(getAdmin)
//     .post(postAdmin);

export default router;