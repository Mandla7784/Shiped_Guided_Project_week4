import { integer, pgTable, varchar, boolean, json } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  subscribtion: varchar({ length: 255 }).notNull(),
});

export const courseTable = pgTable("courses", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  cid: integer("cid").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: varchar("description", { length: 255 }).notNull(),
  noOfChapters: integer("noOfChapters").notNull(),
  includeVideo: boolean("includeVideo").default(false),
  level: varchar("level", { length: 50 }),
  category: varchar("category", { length: 100 }),
  courseJson: json("courseJson"),
  userEmail: varchar("userEmail").references(() => usersTable.email),
});

export const enrollmentsTable = pgTable("enrollments", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userEmail: varchar("userEmail", { length: 255 }).notNull(),
  courseCid: integer("courseCid").notNull(),
});

export const progressTable = pgTable("progress", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userEmail: varchar("userEmail", { length: 255 }).notNull(),
  courseCid: integer("courseCid").notNull(),
  chapterIndex: integer("chapterIndex").notNull(),
});