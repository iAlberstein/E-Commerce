import express from "express";
import passport from "passport";
import UserController from "../controllers/user.controller.js";
import UserRepository from "../repositories/user.repository.js";
import upload from "../middleware/multer.js";

const router = express.Router();
const userController = new UserController();
const userRepository = new UserRepository();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/profile", passport.authenticate("jwt", { session: false }), userController.profile);
router.post("/logout", userController.logout.bind(userController));
router.get("/admin", passport.authenticate("jwt", { session: false }), userController.admin);
router.post("/requestPasswordReset", userController.requestPasswordReset);
router.post('/reset-password', userController.resetPassword);

// Ruta para visualizar la lista de usuarios
router.get("/users", passport.authenticate("jwt", { session: false }), userController.listUsers);

// Ruta para modificar el rol de usuario
router.post("/:userId/role", passport.authenticate("jwt", { session: false }), userController.updateUserRole);

router.put("/premium/:uid", userController.cambiarRolPremium);

router.post("/:uid/documents", upload.fields([{ name: "document" }, { name: "products" }, { name: "profile" }]), async (req, res) => {
    const { uid } = req.params;
    const uploadedDocuments = req.files;

    try {
        const user = await userRepository.findById(uid);

        if (!user) {
            return res.status(404).send("Usuario no encontrado");
        }

        if (uploadedDocuments) {
            if (uploadedDocuments.document) {
                user.documents = user.documents.concat(uploadedDocuments.document.map(doc => ({
                    name: doc.originalname,
                    reference: doc.path
                })));
            }

            if (uploadedDocuments.products) {
                user.documents = user.documents.concat(uploadedDocuments.products.map(doc => ({
                    name: doc.originalname,
                    reference: doc.path
                })));
            }

            if (uploadedDocuments.profile) {
                user.documents = user.documents.concat(uploadedDocuments.profile.map(doc => ({
                    name: doc.originalname,
                    reference: doc.path
                })));
            }
        }

        await user.save();

        res.status(200).send("Documentos cargados exitosamente");
    } catch (error) {
        console.log(error);
        res.status(500).send("Error interno del servidor");
    }
});

export default router;
