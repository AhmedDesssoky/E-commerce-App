import { z } from "zod";

const egyptianMobile = /^01[0125]\d{8}$/;

export const signUpSchema = z
  .object({
    name: z.string().trim().min(3, "nameMin"),
    email: z.string().trim().pipe(z.email("email")),
    password: z.string().min(6, "passwordMin"),
    rePassword: z.string(),
    phone: z.string().trim().regex(egyptianMobile, "phone"),
  })
  .refine((value) => value.password === value.rePassword, {
    path: ["rePassword"],
    error: "rePassword",
  });

export type SignUpValues = z.infer<typeof signUpSchema>;
