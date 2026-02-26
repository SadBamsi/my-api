import { Request, Response } from "express";
import {
  createAccountSchema,
  getAccountsSchema,
  deleteAccountSchema,
} from "./account.validaion";
import prisma from "../prisma/client";

export const createAccount = async (req: Request, res: Response) => {
  const validation = createAccountSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: validation.error.format(),
    });
  }

  const { userId, accountName, balance, currency } = validation.data;

  try {
    // Check if user exists
    const user = await (prisma as any).user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newAccount = await (prisma as any).account.create({
      data: {
        userId,
        accountName,
        balance: balance ?? 0,
        currency,
      },
    });

    res.status(201).json({
      message: "Account created successfully",
      account: newAccount,
    });
  } catch (error) {
    console.error("Error creating account:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAccountsByUser = async (req: Request, res: Response) => {
  const validation = getAccountsSchema.safeParse(req.params);

  if (!validation.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: validation.error.format(),
    });
  }

  const { userId } = validation.data;

  try {
    const accounts = await (prisma as any).account.findMany({
      where: { userId },
    });

    res.json(accounts);
  } catch (error) {
    console.error("Error fetching accounts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteAccount = async (req: Request, res: Response) => {
  const validation = deleteAccountSchema.safeParse(req.params);

  if (!validation.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: validation.error.format(),
    });
  }

  const { accountId } = validation.data;

  try {
    const account = await (prisma as any).account.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    await (prisma as any).account.delete({
      where: { id: accountId },
    });

    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
