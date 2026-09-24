import { z } from "zod";

const create = z.object({
  body: z
    .object({
      phone: z.number().int().min(1, "phone must be a positive integer"),
      first_name: z.string().min(1, "first_name is required"),
      last_name: z.string().min(1, "last_name is required"),
      gender: z.string().optional(),
      years_of_experience: z.string().optional(),
      date_of_birth: z.string().optional(),
    })
    .strict(),
  cookies: z.string({ error: "forbidden access" }).min(1, "forbidden access"),
});


const update = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
      user_id: z.number().int().min(1, "user_id must be a positive integer"),
    is_active: z.boolean().optional(),
  }),
});

const profileValidation = Object.freeze({
  create,
  update,
});

export default profileValidation;
