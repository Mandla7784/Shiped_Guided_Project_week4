import { duration } from "drizzle-orm/gel-core";
import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { boolean, json } from "zod";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  subscribtion: varchar({ length: 255 }).notNull(),
});


export const courseTable = pgTable("courses", {
  id: integer("id").primaryKey().notNull(),
  cid: integer("cid").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: varchar("description", { length: 255 }).notNull(),
  noOfChapters: integer("noOfChapters").notNull(),
  includeVideo:boolean("includeVideo"),
  level:varchar(),
  category:varchar(),
  courseJson:json(),
  userEmail:varchar('userEmail').references(()=>usersTable.email))
 
});