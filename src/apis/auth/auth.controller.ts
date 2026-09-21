import type { Request, Response } from "express";

const signUp = async (req: Request, res: Response) => {
  console.log(req.body);
};





export const authController = Object.freeze({
  signUp,
});