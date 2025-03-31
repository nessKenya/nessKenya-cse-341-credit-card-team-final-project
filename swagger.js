const swaggerAutogen = require('swagger-autogen')();
const isProduction = process.env.NODE_ENV === "production"

const doc = {
  info: {
    title: 'Credit Card API',
    description: 'Description'
  },
  host: isProduction?"nesskenya-cse-341-credit-card-team-final.onrender.com":"localhost:8080",
  schemes: isProduction ? ['https'] : ['http'],
};

const outputFile = './swagger-output.json';
const routes = ['./routes/index.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);
