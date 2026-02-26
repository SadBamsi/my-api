import { z } from "zod";

export const createAccountSchema = z.object({
  userId: z.number().int().positive("Invalid User ID format"),
  accountName: z.string().min(1, "Account name is required"),
  balance: z.number().min(0, "Balance must be a positive number").optional(),
  currency: z.string().min(1, "Currency is required"),
});

export type CreateAccountSchema = z.infer<typeof createAccountSchema>;

export const getAccountsSchema = z.object({
  userId: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().positive()),
});

export const deleteAccountSchema = z.object({
  accountId: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().positive()),
});
