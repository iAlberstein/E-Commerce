// helpers/handlebars-helpers.js

// Definir el helper ifEqual
const ifEqual = (a, b, options) => {
    if (a === b) {
      return options.fn(this);
    }
    return options.inverse(this);
  };
  
  // Exportar el helper ifEqual
  export { ifEqual};

  