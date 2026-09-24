import { z } from "zod";

const create = z.object({
  body: z.object({
    specialty_id: z.number().int().min(1, "specialty_id must be a positive integer"),
  }).strict(),
  cookies: z.string({error:"forbidden access"}).min(1, "forbidden access"),
});

const update = z.object({
  body: z.object({
  }),
});

const usersSpecialtyValidation = Object.freeze({
  create,
  update,
});

export default usersSpecialtyValidation;
