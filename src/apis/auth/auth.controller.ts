import type { Request, Response } from "express";
import authService from "./auth.service.ts";
import { sendResponse } from "../../utils/sendResponse.ts";
import { httpStatus } from "../../secrets/secrets.ts";

const signUp = async (req: Request, res: Response) => {
  const result = await authService.SignUp(req.body);
  sendResponse(res, httpStatus.SUCCESS, result);
};

export const authController = Object.freeze({
  signUp,
});
