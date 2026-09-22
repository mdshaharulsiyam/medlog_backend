import type { NextFunction, Request, Response } from "express";
import type { ZodTypeAny } from "zod";
import { secrets } from "../secrets/secrets.ts";
import ErrorHandler from "../utils/globalErrorHandler.ts";

const validateRequest = (
  schema: ZodTypeAny,
  type: string = secrets.TOKEN_NAME as string,
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.files) {
        const files = req.files as any;
        const img =
          (!Array.isArray(files) &&
            files?.img &&
            files.img.length > 0 &&
            files.img?.map((doc: any) => doc.path)) ||
          [];
        const video =
          (!Array.isArray(files) &&
            files?.video &&
            files.video.length > 0 &&
            files.video?.map((doc: any) => doc.path)) ||
          [];
        const logo =
          (!Array.isArray(files) &&
            files?.logo &&
            files.logo.length > 0 &&
            files.logo?.map((doc: any) => doc.path)) ||
          [];
        const documents =
          (!Array.isArray(files) &&
            files?.documents &&
            files.documents.length > 0 &&
            files.documents?.map((doc: any) => doc.path)) ||
          [];
        const business_documents =
          (!Array.isArray(files) &&
            files?.business_documents &&
            files.business_documents.length > 0 &&
            files.business_documents?.map((doc: any) => doc.path)) ||
          [];
        const banner =
          (!Array.isArray(files) &&
            files?.banner &&
            files.banner.length > 0 &&
            files.banner?.map((doc: any) => doc.path)) ||
          [];
        const business_document =
          (!Array.isArray(files) &&
            files?.business_document &&
            files.business_document.length > 0 &&
            files.business_document?.map((doc: any) => doc.path)) ||
          [];
        const workplace_image =
          (!Array.isArray(files) &&
            files?.workplace_image &&
            files.workplace_image.length > 0 &&
            files.workplace_image?.map((doc: any) => doc.path)) ||
          [];
        const nid_image =
          (!Array.isArray(files) &&
            files?.nid_image &&
            files.nid_image.length > 0 &&
            files.nid_image?.map((doc: any) => doc.path)) ||
          [];
        if (img.length > 0) req.body.img = img;
        if (banner.length > 0) req.body.banner = banner;
        if (logo.length > 0) req.body.logo = logo;
        if (video.length > 0) req.body.video = video;
        if (documents.length > 0) req.body.documents = documents;
        if (business_documents.length > 0)
          req.body.business_documents = business_documents;
        if (business_document.length > 0)
          req.body.business_document = business_document;
        if (workplace_image.length > 0)
          req.body.workplace_image = workplace_image;
        if (nid_image.length > 0) req.body.nid_image = nid_image;

        req.body.all_images = [
          ...business_documents,
          ...documents,
          ...video,
          ...logo,
          ...banner,
          ...img,
          ...business_document,
          ...workplace_image,
          ...nid_image,
        ];
      }
      await schema.parseAsync({
        body: req.body,
        cookies: req.headers.authorization || req.cookies?.[type],
      });
      return next();
    } catch (error) {
      if (req.body?.all_images?.length > 0) {
        // UnlinkFiles(req.body?.all_images);
      }
      ErrorHandler(error, req, res, next);
    }
  };
};

export default validateRequest;

