import ProductRepository from "../repositories/product.repository.js";
const productRepository = new ProductRepository();



class ProductController {

    async addProduct(req, res) {
        try {
            
            const { title, description, price, img, code, stock, category, thumbnails } = req.body;

            const newProduct = await productRepository.agregarProducto({
                title,
                description,
                price,
                img,
                code,
                stock,
                category,
                thumbnails,
                owner
            });

            if (newProduct) {
                res.status(201).json({ message: 'Producto agregado exitosamente', product: newProduct });
            } else {
                res.status(400).json({ message: 'Error al agregar el producto' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
    
    async getProducts(req, res) {
        try {
            let { limit = 10, page = 1, sort, query } = req.query;

            const productos = await productRepository.obtenerProductos(limit, page, sort, query);
           
            res.json(productos);
        } catch (error) { 
            res.status(500).send("Error");
        }
    }
    
    

    async getProductById(req, res) {
        const id = req.params.pid;
        try {
            const producto = await productRepository.obtenerProductoPorId(id);

            if (!producto) {
                return res.status(404).render("404", { message: "Producto no encontrado" });
            }
            res.render("productinfo", producto );
        } catch (error) {
            res.status(500).send("Error interno del servidor");
        }
    }

    async updateProduct(req, res) {
        try {
            const id = req.params.pid;
            const productoActualizado = req.body;

            const resultado = await productRepository.actualizarProducto(id, productoActualizado);
            res.json(resultado);
        } catch (error) {
            res.status(500).send("Error al actualizar el producto");
        }
    }
    

    async deleteProduct(req, res) {
        const id = req.params.pid;
        const usuario = req.user; 
    
        try {
            // Obtener el producto para verificar el owner
            const producto = await productRepository.obtenerProductoPorId(id);
            
            // Verificar si el usuario es el owner o es admin
            if (producto.owner !== usuario.email && usuario.role !== 'admin') {
                return res.status(403).send("No tienes permiso para eliminar este producto");
            }
    
            let respuesta = await productRepository.eliminarProducto(id);
            res.json(respuesta);
        } catch (error) {
            res.status(500).send("Error al eliminar el producto");
        }
    }
    
}

export default ProductController;
