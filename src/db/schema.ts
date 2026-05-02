import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

// ----------------------- projects -----------------------
export const projects = sqliteTable(
  "projects",
  {
    id: text("id").primaryKey(), // ULID
    name: text("name").notNull(),
    description: text("description"),
    status: text("status", { enum: ["active", "archived", "draft"] })
      .notNull()
      .default("active"),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (t) => ({
    statusIdx: index("projects_status_idx").on(t.status),
    createdAtIdx: index("projects_created_at_idx").on(t.createdAt),
  }),
);

// --------------------- requirements ---------------------
export const requirements = sqliteTable(
  "requirements",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    priority: text("priority", {
      enum: ["low", "medium", "high", "critical"],
    })
      .notNull()
      .default("medium"),
    status: text("status", { enum: ["pending", "in-progress", "done"] })
      .notNull()
      .default("pending"),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (t) => ({
    projectIdx: index("requirements_project_idx").on(t.projectId),
    statusIdx: index("requirements_status_idx").on(t.status),
  }),
);

// ----------------------- expenses -----------------------
export const expenses = sqliteTable(
  "expenses",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    label: text("label").notNull(),
    amount: integer("amount").notNull(), // cents
    category: text("category", {
      enum: [
        "infrastructure",
        "tooling",
        "design",
        "marketing",
        "hardware",
        "subscriptions",
        "other",
      ],
    })
      .notNull()
      .default("other"),
    notes: text("notes"),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (t) => ({
    projectIdx: index("expenses_project_idx").on(t.projectId),
    categoryIdx: index("expenses_category_idx").on(t.category),
  }),
);

// ------------------------- links ------------------------
export const links = sqliteTable(
  "links",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    url: text("url").notNull(),
    description: text("description"),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (t) => ({
    projectIdx: index("links_project_idx").on(t.projectId),
  }),
);

// ------------------------- notes ------------------------
export const notes = sqliteTable(
  "notes",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (t) => ({
    projectIdx: index("notes_project_idx").on(t.projectId),
    createdAtIdx: index("notes_created_at_idx").on(t.createdAt),
  }),
);

// ----------------------- relations ----------------------
export const projectsRelations = relations(projects, ({ many }) => ({
  requirements: many(requirements),
  expenses: many(expenses),
  links: many(links),
  notes: many(notes),
}));

export const requirementsRelations = relations(requirements, ({ one }) => ({
  project: one(projects, {
    fields: [requirements.projectId],
    references: [projects.id],
  }),
}));

export const expensesRelations = relations(expenses, ({ one }) => ({
  project: one(projects, {
    fields: [expenses.projectId],
    references: [projects.id],
  }),
}));

export const linksRelations = relations(links, ({ one }) => ({
  project: one(projects, {
    fields: [links.projectId],
    references: [projects.id],
  }),
}));

export const notesRelations = relations(notes, ({ one }) => ({
  project: one(projects, {
    fields: [notes.projectId],
    references: [projects.id],
  }),
}));

// inferred row types
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type Requirement = typeof requirements.$inferSelect;
export type NewRequirement = typeof requirements.$inferInsert;
export type Expense = typeof expenses.$inferSelect;
export type NewExpense = typeof expenses.$inferInsert;
export type Link = typeof links.$inferSelect;
export type NewLink = typeof links.$inferInsert;
export type Note = typeof notes.$inferSelect;
export type NewNote = typeof notes.$inferInsert;