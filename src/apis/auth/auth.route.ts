import express from "express";
import asyncWrapper from "../../utils/asyncWrapper.ts";
import { authController } from "./auth.controller.ts";
const authRoute = express.Router();

authRoute
  .post("/sign-up", asyncWrapper(authController.signUp))

  .post("/login", asyncWrapper(authController.login));

export default authRoute;
