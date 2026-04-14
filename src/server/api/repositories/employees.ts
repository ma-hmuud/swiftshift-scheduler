import { asc, eq } from "drizzle-orm";

import { db } from "~/server/db";
import { user } from "~/server/db/schema";

export const listEmployeesDb = async () => {
  return db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    })
    .from(user)
    .where(eq(user.role, "employee"))
    .orderBy(asc(user.name));
};
