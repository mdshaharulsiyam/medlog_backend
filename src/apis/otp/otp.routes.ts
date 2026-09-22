import express from "express";
import otpController from "./otp.controller.ts";
const otpRoute = express.Router();


otpRoute.post('/',otpController.create)
.post('/verify',otpController.verify)

export default otpRoute;