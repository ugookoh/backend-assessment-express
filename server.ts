import express from "express";
import bodyParser from "body-parser";
import routes from "./app/routes";
import { AppDataSource } from "./app/database";
import dotenv from "dotenv";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import rateLimiter from "./app/middlewares";

dotenv.config({ path: ".env" });

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Backend API Documentation",
      description: "This is the documentation for our backend service",
      version: "1.0.0",
    },
  },
  apis: ["./app/routes/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(rateLimiter);
app.use("/", routes);
app.use(
  "/docs",
  swaggerUi.serve as unknown as express.RequestHandler,
  swaggerUi.setup(swaggerSpec) as unknown as express.RequestHandler
);
app.use((req, res, next) => {
  res.status(404).send({ error: "Route not found" });
  next();
});

const PORT = process.env.PORT || 8080;

const startServer = async () => {
  await AppDataSource.initialize();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
};

startServer();
