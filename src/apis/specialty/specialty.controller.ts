import type { Request, Response } from "express";
import specialtyService from "./specialty.service.ts";
import { sendResponse } from "../../utils/sendResponse.ts";
import { httpStatus } from "../../secrets/secrets.ts";

const create = async (req: Request, res: Response) => {
  const result = await specialtyService.create(req.body);
  sendResponse(res, httpStatus.CREATED, result);
};

const getAll = async (req: Request, res: Response) => {
  const result = await specialtyService.getAll(
    req.query.page ? parseInt(req.query.page as string) : 1,
    req.query.limit ? parseInt(req.query.limit as string) : 10,
  );
  sendResponse(res, httpStatus.SUCCESS, result);
};

// const getById = async (req: Request, res: Response) => {
//   const result = await specialtyService.getById(req.params.id);
//   sendResponse(
//     res,
//     result.success ? httpStatus.SUCCESS : httpStatus.NOT_FOUND,
//     result,
//   );
// };

const update = async (req: Request, res: Response) => {
  const result = await specialtyService.update(req.params.id?.toString(), req.body);
  sendResponse(
    res,
    result.success ? httpStatus.SUCCESS : httpStatus.NOT_FOUND,
    result,
  );
};

const remove = async (req: Request, res: Response) => {
  const result = await specialtyService.remove(req.params.id?.toString());
  sendResponse(
    res,
    result.success ? httpStatus.SUCCESS : httpStatus.NOT_FOUND,
    result,
  );
};

const specialtyController = Object.freeze({
  create,
  getAll,
  // getById,
  update,
  remove,
});

export default specialtyController;
