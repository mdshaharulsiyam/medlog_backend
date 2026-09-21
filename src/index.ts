import express, { type Express, type Request, type Response } from "express";
import { logger, requestLogger } from "./middlewares/logger.ts";
import { applyMiddleWare } from "./middlewares/applyMiddleWare.ts";
import { checkDatabaseConnection } from "./db/connectDB.ts";
import os from "node:os";
import { secrets } from "./secrets/secrets.ts";
import { routeMiddleWare } from "./middlewares/routeMiddleWare.ts";
const app: Express = express();

applyMiddleWare(app);

routeMiddleWare(app);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});
app.use(`/*all`, (req, res) => {
  res.send({
    success: false,
    message: "who are you",
  });
});
const getLocalIp = () => {
  const interfaces = os.networkInterfaces();

  for (const name of Object.keys(interfaces)) {
    for (const network of interfaces[name] ?? []) {
      if (network.family === "IPv4" && !network.internal) {
        return network.address;
      }
    }
  }

  return "localhost";
};

app.listen(secrets.port, () => {
  console.log("server running");
  logger.info(`Server running at http://${getLocalIp()}:${secrets.port}`);
  checkDatabaseConnection();
});
