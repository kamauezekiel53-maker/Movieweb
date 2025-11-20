import { initTRPC } from "@trpc/server";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "@/prisma/client";

const t = initTRPC.create();
const JWT_SECRET = process.env.JWT_SECRET || "please_change_me";

export const authRouter = t.router({
  register: t.procedure
    .input(z.object({ email: z.string().email(), password: z.string().min(6), name: z.string().optional() }))
    .mutation(async ({ input }) => {
      const existing = await prisma.user.findUnique({ where: { email: input.email } });
      if (existing) throw new Error("User already exists");
      const hash = await bcrypt.hash(input.password, 10);
      const user = await prisma.user.create({ data: { email: input.email, password: hash, name: input.name } });
      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "30d" });
      return { token, user: { id: user.id, email: user.email, name: user.name } };
    }),

  login: t.procedure
    .input(z.object({ email: z.string().email(), password: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const user = await prisma.user.findUnique({ where: { email: input.email } });
      if (!user) throw new Error("Invalid credentials");
      const ok = await bcrypt.compare(input.password, user.password);
      if (!ok) throw new Error("Invalid credentials");
      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "30d" });
      return { token, user: { id: user.id, email: user.email, name: user.name } };
    }),

  me: t.procedure.query(async ({ ctx }) => {
    if (!ctx.user || !ctx.user.id) return null;
    const user = await prisma.user.findUnique({ where: { id: ctx.user.id }, select: { id: true, email: true, name: true } });
    return user;
  }),
});