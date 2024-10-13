import winston from "winston";
import configObject from '../config/config.js';


// traer del configObject: node_env
const { node_env } = configObject;

const niveles = {
    nivel: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4, 
        debug: 5
    },
    colores: {
        fatal: "red",
        error: "yellow",
        warning: "blue",
        info: "green",
        http: "magenta",
        debug: "white"
    }
}

// logger para desarrollo:
const loggerDesarrollo = winston.createLogger({
    levels: niveles.nivel,
    transports: [
        new winston.transports.Console({
            level: "debug",
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ]
});

// logger para producción:
const loggerProduccion = winston.createLogger({
    levels: niveles.nivel,
    transports: [
        new winston.transports.File({
            filename: "./error.log",
            level: "error"
        })
    ]
});

// determinar que logger usar de acuerdo a la variable de entorno (.env)
const logger = node_env === "produccion" ? loggerProduccion : loggerDesarrollo;

// middleware
const addLogger = (req, res, next) => {
    req.logger = logger;
    req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`);
    next();
};

// exportar el middleware
module.exports = {
    addLogger
};
