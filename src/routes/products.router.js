import express from "express";
const router = express.Router();
import ProductController from "../controllers/product.controller.js";
const productController = new ProductController();
import passport from "passport";


router.get("/", productController.getProducts);
router.get("/:pid", productController.getProductById);
router.post("/", passport.authenticate("jwt", { session: false }) ,productController.addProduct);
router.put("/:pid", productController.updateProduct);
router.delete("/:pid", productController.deleteProduct);

export default router;