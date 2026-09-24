import express from "express";
import asyncWrapper from "../../utils/asyncWrapper.ts";
import { authController } from "./auth.controller.ts";
import verifyToken from "../../middlewares/verifyToken.ts";
import { secrets } from "../../secrets/secrets.ts";
import validateRequest from "../../middlewares/validateRequest.ts";
import { authValidation } from "./auth.validation.ts";
const authRoute = express.Router();

authRoute
  .post(
    "/sign-up",
    validateRequest(authValidation.signUp),
    asyncWrapper(authController.signUp),
  )

  .post(
    "/create-account",
    asyncWrapper(authController.createAccount),
    )

  .post(
    "/login",
    validateRequest(authValidation.login),
    asyncWrapper(authController.login),
  )

  .patch(
    "/change-password",
    validateRequest(authValidation.changePassword),
    verifyToken(secrets.USER),
    asyncWrapper(authController.changePassword),
  )

  .patch(
    "/reset-password",
    validateRequest(authValidation.resetPassword),
    verifyToken(secrets.USER, true, secrets.ACCESS_TOKEN_NAME),
    asyncWrapper(authController.resetPassword),
  );



export default authRoute;
