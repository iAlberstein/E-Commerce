import { Server as socket } from "socket.io";
import ProductRepository from "../repositories/product.repository.js";
const productRepository = new ProductRepository();
import MessageModel from "../models/message.model.js";

class SocketManager {
    constructor(httpServer) {
        this.io = new socket(httpServer); // Usa `new` para crear una instancia de Server
        this.initSocketEvents();
    }

    async initSocketEvents() {
        this.io.on("connection", async (socket) => {
            console.log("Un cliente se conectó");
            
            socket.emit("productos", await productRepository.obtenerProductos());

            socket.on("eliminarProducto", async (id) => {
                await productRepository.eliminarProducto(id);
                this.emitUpdatedProducts(socket);
            });

            socket.on("agregarProducto", async (producto) => {
                await productRepository.agregarProducto(producto);
                console.log(producto);
                this.emitUpdatedProducts(socket);
            });

            socket.on("message", async (data) => {
                await MessageModel.create(data);
                const messages = await MessageModel.find();
                socket.emit("message", messages);
            });
            socket.on("authenticate", (data) => {
                const {email} = data; 
                socket.emit("userAuthenticated", email);
               });
            
        });
    }

    async emitUpdatedProducts(socket) {
        socket.emit("productos", await productRepository.obtenerProductos());
    }
}

export default SocketManager;
