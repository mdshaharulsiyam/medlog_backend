import type { Request, Response, NextFunction } from "express";
import ErrorHandler from "./globalErrorHandler.ts";

const asyncWrapper = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>,
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch((error) => {
      if (req.body?.all_images?.length > 0) {
        // UnlinkFiles(req.body?.all_images);
      }
      ErrorHandler(error, req, res, next);
    });
  };
};

export default asyncWrapper;
