import express from "express";
import otpController from "./otp.controller.ts";
import asyncWrapper from "../../utils/asyncWrapper.ts";
import validateRequest from "../../middlewares/validateRequest.ts";
import otpValidation from "./otp.validation.ts";
const otpRoute = express.Router();

otpRoute
  .post(
    "/",
    validateRequest(otpValidation.create),
    asyncWrapper(otpController.create),
  )
  .post(
    "/verify",
    validateRequest(otpValidation.verify),
    asyncWrapper(otpController.verify),
  );

export default otpRoute;