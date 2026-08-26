import z from "zod/v4";


export const registerUserSchema = z.object({
  name: z.string().trim().max(10).min(1),
  email: z.email(),
  password: z.string().min(8)
})

export const updateUserSchema = z.object({
  name: z.string().trim().max(10).min(1).optional(),
  password: z.string().min(8).optional()
})