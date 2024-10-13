import express from "express";
const router = express.Router();
import ViewsController from "../controllers/view.controller.js";
const viewsController = new ViewsController();
import checkUserRole from "../middleware/checkrole.js";
import passport from "passport";

// Ruta para productos, visible para usuarios y premium
router.get("/products", checkUserRole(['user', 'premium']), passport.authenticate('jwt', { session: false }), viewsController.renderProducts);

// Ruta para carrito
router.get("/carts/:cid", viewsController.renderCart);

// Ruta para login
router.get("/login", viewsController.renderLogin);

// Ruta para registro
router.get("/register", viewsController.renderRegister);

// Ruta para productos en tiempo real
router.get("/realtimeproducts", checkUserRole(['admin', 'premium']), passport.authenticate('jwt', { session: false }), viewsController.renderRealTimeProducts);

// Ruta para chat, visible para usuarios
router.get("/chat", checkUserRole(['user']), passport.authenticate('jwt', { session: false }), viewsController.renderChat);

// Ruta para home
router.get("/", viewsController.renderHome);

// Ruta para restablecimiento de contraseña
router.get("/reset-password", viewsController.renderResetPassword);

// Ruta para cambio de contraseña
router.get("/password", viewsController.renderCambioPassword);

// Ruta para confirmación de envío
router.get("/confirmacion-envio", viewsController.renderConfirmacion);

// Ruta para panel premium
router.get("/panel-premium", checkUserRole(['premium']), passport.authenticate('jwt', { session: false }), viewsController.renderPremium);

router.get("/users", viewsController.renderUsers);

export default router;
