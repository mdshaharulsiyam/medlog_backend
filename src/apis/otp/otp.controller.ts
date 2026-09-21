import type { Request, Response } from "express";
import otpService from "./otp.service.ts";
import { sendResponse } from "../../utils/sendResponse.ts";

const create = async (req: Request, res: Response) => {
   const result = await otpService.create(req.body);
  sendResponse(res, 200, result);
}; 

 const otpController = Object.freeze({
   create,
 });
export default otpController;