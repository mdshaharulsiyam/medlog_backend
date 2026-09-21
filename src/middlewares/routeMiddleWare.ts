import { type Express } from "express";
import authRoute from "../apis/auth/auth.route.ts";
export const routeMiddleWare = (app: Express) => {
  app.use("/auth", authRoute);
};
