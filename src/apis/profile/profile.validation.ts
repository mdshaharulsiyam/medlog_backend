import { z } from "zod";

const create = z.object({
  body: z.object({
    title: z.string({ error: "title is required" }).min(1, "title is required"),
    description: z.string().optional(),
  }),
});

const update = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    is_active: z.boolean().optional(),
  }),
});

const profileValidation = Object.freeze({
  create,
  update,
});

export default profileValidation;
