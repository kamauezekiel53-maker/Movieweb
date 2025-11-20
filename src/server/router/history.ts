import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { prisma } from "@/prisma/client";

const t = initTRPC.create();

export const historyRouter = t.router({
  upsert: t.procedure
    .input(z.object({ movieId: z.string(), position: z.number().min(0) }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user || !ctx.user.id) throw new Error("Not authenticated");
      const existing = await prisma.watchHistory.findFirst({
        where: { userId: ctx.user.id, movieId: input.movieId },
      });
      if (existing) {
        const updated = await prisma.watchHistory.update({
          where: { id: existing.id },
          data: { position: input.position },
        });
        return updated;
      } else {
        const created = await prisma.watchHistory.create({
          data: { userId: ctx.user.id, movieId: input.movieId, position: input.position },
        });
        return created;
      }
    }),

  getForUser: t.procedure
    .input(z.object({ movieId: z.string() }))
    .query(async ({ input, ctx }) => {
      if (!ctx.user || !ctx.user.id) return null;
      const h = await prisma.watchHistory.findFirst({
        where: { userId: ctx.user.id, movieId: input.movieId },
      });
      return h;
    }),
});