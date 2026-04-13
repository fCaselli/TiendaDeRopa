import { Router } from "express";
import { getProducts, getProductById } from "../controllers/products.controller.js";
import { validateObjectIdParam } from "../middlewares/validateObjectId.js";

const router = Router();
router.get("/", getProducts);
router.get("/:id", validateObjectIdParam("id"), getProductById);
export default router;
