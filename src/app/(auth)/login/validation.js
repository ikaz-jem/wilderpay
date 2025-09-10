import {z} from 'zod'

export const loginSchema = z.object({
    email: z.string({message:'Invalid Email'}).email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  });
  