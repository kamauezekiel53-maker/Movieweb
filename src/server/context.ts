import { prisma } from "@/prisma/client";
import jwt from "jsonwebtoken";

export type Context = {
  user?: { id: string; email: string } | null;
  prisma: typeof prisma;
};

const JWT_SECRET = process.env.JWT_SECRET || "please_change_me";

export async function createContext({ req }: { req: Request }): Promise<Context> {
  try {
    const auth = req.headers.get("authorization") || "";
    if (auth.startsWith("Bearer ")) {
      const token = auth.replace("Bearer ", "");
      const payload = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
      if (payload?.userId) {
        return { prisma, user: { id: payload.userId, email: payload.email } };
      }
    }
  } catch (err) {
    // invalid token -> continue unauthenticated
  }
  return { prisma, user: null };
}