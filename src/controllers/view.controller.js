import ProductModel from "../models/product.model.js";
import CartRepository from "../repositories/cart.repository.js";
const cartRepository = new CartRepository();
import UserModel from "../models/user.model.js";


class ViewsController {
    async renderProducts(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const skip = (page - 1) * limit;
            let filter = {};
    
            // Verificar el rol del usuario y ajustar el filtro
            if (req.user.role === 'premium') {
                filter = {
                    $or: [
                        { owner: { $ne: req.user.email } }, // Excluir productos del usuario
                        { owner: { $exists: false } } // Incluir productos sin propietario
                    ]
                };
            }
    
            const productos = await ProductModel
                .find(filter)
                .skip(skip)
                .limit(limit);
    
            const totalProducts = await ProductModel.countDocuments(filter);
            const totalPages = Math.ceil(totalProducts / limit);
    
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;
    
            const nuevoArray = productos.map(producto => {
                const { _id, ...rest } = producto.toObject();
                return { id: _id, ...rest };
            });
    
            const cartId = req.user.cart.toString();
            res.render("products", {
                productos: nuevoArray,
                hasPrevPage,
                hasNextPage,
                prevPage: page > 1 ? parseInt(page) - 1 : null,
                nextPage: page < totalPages ? parseInt(page) + 1 : null,
                currentPage: parseInt(page),
                totalPages,
                cartId
            });
    
        } catch (error) {
            console.error("Error al obtener productos", error);
            res.status(500).json({
                status: 'error',
                error: "Error interno del servidor"
            });
        }
    }
    
    
    
    

    async renderCart(req, res) {
        const cartId = req.params.cid;
        try {
            const carrito = await cartRepository.obtenerProductosDeCarrito(cartId);
    
            if (!carrito) {
                console.log("No existe ese carrito con el id");
                return res.status(404).json({ error: "Carrito no encontrado" });
            }
    
            let totalCompra = 0;
    
            const productosEnCarrito = carrito.products.map(item => {
                const product = item.product.toObject();
                const quantity = item.quantity;
                const totalPrice = product.price * quantity;
    
                
                totalCompra += totalPrice;
    
                return {
                    product: { 
                        ...product, 
                        totalPrice,
                        img: product.img 
                    },
                    quantity,
                    cartId
                };
            });
    
            // Renderizar la vista del carrito con los productos y el total de la compra
            res.render("carts", { productos: productosEnCarrito, totalCompra, cartId });
        } catch (error) {
            console.error("Error al obtener el carrito", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
    

    async renderLogin(req, res) {
        res.render("login");
    }

    async renderRegister(req, res) {
        res.render("register");
    }

    async renderRealTimeProducts(req, res) {
        try {
            const user = req.user;
            let filter = {};
    
            if (user && user.role === 'premium') {
                filter = { owner: user.email };
            } else if (user && user.role === 'admin') {
                filter = {}; // Mostrar todos los productos
            }

            const productos = await ProductModel.find(filter);
            console.log(user.role)
            res.render("realtimeproducts", {
                productos,
                role: user.role,
                email: user.email
            });
        } catch (error) {
            console.log("Error en la vista real time", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
    
    
    async renderManageUsers(req, res) {
        try {
            if (req.user.role !== 'admin') {
                return res.status(403).json({ error: "Acceso denegado" });
            }
    
            const users = await UserModel.find(); // Obtener todos los usuarios
            res.render("manage-users", { users });
        } catch (error) {
            console.error("Error al obtener usuarios", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
    

    async renderChat(req, res) {
        res.render("chat");
    }

    async renderHome(req, res) {
        res.render("home"); 
    }

    async renderProductInfo (req, res) {
        res.render("productinfo");
    }

    //Tercer integradora: 
    async renderResetPassword(req, res) {
        res.render("passwordreset");
    }

    async renderCambioPassword(req, res) {
        res.render("passwordcambio");
    }

    async renderConfirmacion(req, res) {
        res.render("confirmacion-envio");
    }

    async renderPremium(req, res) {
        res.render("panel-premium");
    }

    async renderUsers(req, res) {
        try {
            const users = await UserModel.find().lean();  // Aquí agregas .lean()
            res.render('users', { users });
        } catch (error) {
            console.error('Error obteniendo usuarios:', error);
            res.status(500).send('Error obteniendo usuarios');
        }
    }
    
}

export default ViewsController;
