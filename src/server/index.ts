import { initTRPC } from "@trpc/server";
import { movieRouter } from "./router/movie";
import { authRouter } from "./router/auth";
import { historyRouter } from "./router/history";
import { createContext } from "./context";

const t = initTRPC.context<Awaited<ReturnType<typeof createContext>>>().create();

export const appRouter = t.router({
  movie: movieRouter,
  auth: authRouter,
  history: historyRouter,
});

export type AppRouter = typeof appRouter;
export { createContext };