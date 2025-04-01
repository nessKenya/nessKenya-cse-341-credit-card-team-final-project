const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My API",
      version: "1.0.0",
      description: "API documentation for temples",
    },
    servers: [
      {
        url: "https://cse341-project2-jj41.onrender.com", // Change to your server URL
      },
    ],
  },
  apis: ["./routes/*.js"], // Path to API route files
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = { swaggerUi, swaggerSpec };
