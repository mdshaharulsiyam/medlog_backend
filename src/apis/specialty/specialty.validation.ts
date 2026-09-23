import { z } from "zod";

const create = z.object({
  body: z.object({
    name: z.string({ error: "title is required" }).min(1, "title is required"),
  }).strict(),
  cookies: z.string({ error: "unauthorized access" }).min(1, "unauthorized access"),
});


const specialtyValidation = Object.freeze({
  create,
});

export default specialtyValidation;
