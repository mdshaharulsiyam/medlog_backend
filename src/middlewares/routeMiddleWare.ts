import { type Express } from "express";
import authRoute from "../apis/auth/auth.route.ts";
import otpRoute from "../apis/otp/otp.routes.ts";
import specialtyRoute from "../apis/specialty/specialty.routes.ts";
export const routeMiddleWare = (app: Express) => {
  app.use("/auth", authRoute);
  app.use("/otp", otpRoute);
  app.use("/specialties", specialtyRoute);
};
