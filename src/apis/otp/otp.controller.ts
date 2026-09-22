import type { Request, Response } from "express";
import otpService from "./otp.service.ts";
import { sendResponse } from "../../utils/sendResponse.ts";
import { secrets } from "../../secrets/secrets.ts";

const create = async (req: Request, res: Response) => {
  const result = await otpService.create(req.body, "client");
  sendResponse(res, 200, result);
};

const verify = async (req: Request, res: Response) => {
  const result = await otpService.verify(req.body);
  sendResponse(res, 200, result, [
    secrets.ACCESS_TOKEN_SECRET as string,
    result?.data?.password_reset_token as string,
    60 * 3 * 1000,
  ]);
};

const otpController = Object.freeze({
  create,
  verify,
});
export default otpController;
