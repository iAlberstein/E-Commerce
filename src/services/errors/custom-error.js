class CustomError {
    static crearError({nombre = "Error", causa = "Desconocido", mensaje, codigo = 1}) {
        const error = new Error(mensaje);
        error.name = nombre;
        error.causa = causa;
        error.code = codigo;
        throw error;
        // Detiene la ejecución, por eso tenemos que capturarlo.
    }
}

export default CustomError;
