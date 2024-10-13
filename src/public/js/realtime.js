const socket = io(); 
const role = document.getElementById("role").value; // Utiliza el valor
const email = document.getElementById("email").value; // Utiliza el valor



// Escuchando los productos enviados por el servidor
socket.on("productos", (data) => {
    const email = document.getElementById("email").value; // Utiliza el email del usuario
    const role = document.getElementById("role").value; // Utiliza el rol del usuario

    let productosAMostrar;

    if (role === "admin") {
        // Si es admin, muestra todos los productos
        productosAMostrar = data.docs;
    } else if (role === "premium") {
        // Si es premium, muestra solo los productos del usuario
        productosAMostrar = data.docs.filter(product => product.owner === email);
    }

    renderProductos(productosAMostrar);
});

// Función para renderizar los productos y manejar la búsqueda
const renderProductos = (productos) => {
    const contenedorProductos = document.getElementById("contenedorProductos");
    const searchInput = document.getElementById("search");

    const filtrarProductos = () => {
        const query = searchInput.value.toLowerCase();
        const productosFiltrados = productos.filter(item => 
            item.title.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query)
        );
        mostrarProductos(productosFiltrados);
    };

    // Agrega el evento de búsqueda
    searchInput.addEventListener("input", filtrarProductos);

    // Muestra todos los productos inicialmente
    mostrarProductos(productos);
};

// Función para mostrar los productos en el contenedor
const mostrarProductos = (productos) => {
    const contenedorProductos = document.getElementById("contenedorProductos");
    contenedorProductos.innerHTML = "";

    productos.forEach(item => {
        const cardrtp = document.createElement("div");
        cardrtp.classList.add("cardrtp");

        cardrtp.innerHTML = ` 
            <p>${item.title}</p>
            <p>$${item.price}</p>
            <button>Eliminar</button>
        `;

        contenedorProductos.appendChild(cardrtp);

        // Agrega el evento al botón de eliminar
        cardrtp.querySelector("button").addEventListener("click", () => {
            eliminarProducto(item._id);
        });
    });
};



// Función para eliminar un producto
const eliminarProducto = (id) => {
    socket.emit("eliminarProducto", id);
};

// Evento para agregar productos desde el formulario
document.getElementById("btnEnviar").addEventListener("click", () => {
    agregarProducto();
});




// Función para agregar un nuevo producto
const agregarProducto = () => {

    const role = document.getElementById("role").value; // Utiliza el valor
    const email = document.getElementById("email").value; // Utiliza el valor

    
    const producto = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        descriptionExpand: document.getElementById("descriptionExpand").value,
        price: document.getElementById("price").value,
        img: document.getElementById("img").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value,
        status: document.getElementById("status").value === "true",
        owner: role === "premium" ? email : "pepe"
    };
    
    socket.emit("agregarProducto", producto);
}
