import { Router } from "express";
import { sendContactForm } from "../controllers/contact.controller.js";

const router = Router();
router.post("/", sendContactForm);
export default router;
