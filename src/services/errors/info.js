const generarInfoError = (usuario) => {
    return `Los datos están incompletos o no son válidos. Necesitamos recibir los siguientes datos: 
    - Nombre: String, pero recibimos lo siguiente: ${usuario.nombre}
    - Apellido: String, pero recibimos: ${usuario.apellido}
    - Email: String, pero recibimos ${usuario.email}
    `;
};

export default generarInfoError;
