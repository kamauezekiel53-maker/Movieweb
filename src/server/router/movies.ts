import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { giftedSearch, giftedGetMovie, giftedGetSources } from "@/lib/gifted";

const t = initTRPC.create();

export const movieRouter = t.router({
  search: t.procedure.input(z.object({ q: z.string().min(1), page: z.number().optional() })).query(async ({ input }) => {
    const page = input.page ?? 1;
    const data = await giftedSearch(input.q, page);
    return data;
  }),

  get: t.procedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
    const data = await giftedGetMovie(input.id);
    return data;
  }),

  sources: t.procedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
    const data = await giftedGetSources(input.id);
    return data;
  }),

  bestStream: t.procedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
    const sources = await giftedGetSources(input.id);
    if (sources?.results && Array.isArray(sources.results)) {
      const best = sources.results.find((r: any) => r.quality === "720p") || sources.results[0];
      return best;
    }
    return null;
  }),
});