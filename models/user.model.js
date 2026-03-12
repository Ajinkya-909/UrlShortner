import { integer,text, pgTable, varchar, timestamp, uuid } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: uuid().defaultRandom().primaryKey(),
  firstname: varchar('first_name', {length:20}).notNull(),
  lastname: varchar('last_name', {length:20}),
  email: varchar( {length:200}).notNull().unique(),
  password: text().notNull(),
  salt: text().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
});
