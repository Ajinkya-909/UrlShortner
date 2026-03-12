import { uuid } from "drizzle-orm/gel-core";
import { integer,text, pgTable, varchar, timestamp } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: uuid().primaryKey(),
  firstname: varchar('first_name', {length:20}).notNull(),
  lastname: varchar('last_name', {length:20}),
  email: varchar( {length:200}).notNull().unique(),
  password: text().notNull(),
  salt: text().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
});
