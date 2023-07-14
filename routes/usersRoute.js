import express from "express";
import {
    getRegister, 
    postRegister, 
    getLogin, 
    postLogin,
    getLogout,
    getProfile, 
    uploadAvatar, 
    postProfile, 
    deleteProfile 
    } from "../controllers/usersConroller.js";
// import passportConfig from "../config/passportConfig.js";

import ensureAuthenticated from "../helpers/auth.js";

const router = express.Router();
 
router.route("/register").get(getRegister).post(postRegister);
router.route("/login").get(getLogin).post(postLogin);
router.route("/logout").get(getLogout);   

// router.get("/register", getRegister );
// router.post("/register", postRegister);
// router.get("/login", getLogin);
// router.post("/login", postLogin);

router.get("/profile", ensureAuthenticated, getProfile);
router.post("/profile", ensureAuthenticated, uploadAvatar, postProfile);
router.delete("/profile", ensureAuthenticated, deleteProfile);

export default router;
