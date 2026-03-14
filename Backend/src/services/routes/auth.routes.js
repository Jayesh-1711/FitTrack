import express from "express";
import auth from "../controllers/auth.js";

const router = express.Router();

router.post("/user/reg", auth.register);
router.post("/user/login", auth.Login);
router.get("/user/logout", auth.LogOut);

export default router;
