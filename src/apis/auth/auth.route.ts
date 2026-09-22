import express from "express";
import asyncWrapper from "../../utils/asyncWrapper.ts";
import { authController } from "./auth.controller.ts";
import verifyToken from "../../middlewares/verifyToken.ts";
import { secrets } from "../../secrets/secrets.ts";
const authRoute = express.Router();

authRoute
  .post("/sign-up", asyncWrapper(authController.signUp))

  .post("/login", asyncWrapper(authController.login))

  .patch("/change-password",verifyToken(secrets.USER), asyncWrapper(authController.changePassword))

  .patch('/reset-password', verifyToken(secrets.USER,true,secrets.ACCESS_TOKEN_NAME), asyncWrapper(authController.resetPassword))



export default authRoute;
