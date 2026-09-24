import { z } from "zod";

const create = z.object({
  body: z.object({
    specialty_id: z.number().int().min(1, "specialty_id must be a positive integer"),
    profile_id: z.number().int().min(1, "profile_id must be a positive integer"),
  }).strict(),
  cookies: z.string({error:"forbidden access"}).min(1, "forbidden access"),
});

const update = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    is_active: z.boolean().optional(),
  }),
});

const usersSpecialtyValidation = Object.freeze({
  create,
  update,
});

export default usersSpecialtyValidation;
