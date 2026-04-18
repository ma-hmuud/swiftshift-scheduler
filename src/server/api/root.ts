import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { communityRouter } from "./procedures/community";
import { employeeRouter } from "./routers/employee";
import { managerRouter } from "./routers/manager";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  community: communityRouter,
  manager: managerRouter,
  employee: employeeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * await trpc.manager.dashboard();
 */
export const createCaller = createCallerFactory(appRouter);
