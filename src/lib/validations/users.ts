import z from "zod/v4";



export const registerUserSchema = z.object({
  name: z.string({ message: "Name is required" }).trim().max(50).min(1, { message: "Name must be at least 1 characters long" }),
  email: z.email({ message: "Please enter a valid email address"}),
  password: z.string({ message: "Password is required" }).min(8, { message: "Password must be at least 8 characters long" })
})

export const updateUserSchema = z.object({
  name: z.string().trim().max(10).min(1).optional(),
  password: z.string().min(8).optional()
})