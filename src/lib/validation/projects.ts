import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import { projects } from "../../db/schema";

const base = createInsertSchema(projects, {
  name: (s) => s.min(1).max(120),
  description: (s) => s.max(1000).optional(),
  status: (s) => s.enum(["active", "archived", "draft"]),
});

export const createProjectSchema = base.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateProjectSchema = createProjectSchema.partial().extend({
  name: z.string().min(1).max(120).optional(),
  description: z.string().max(1000).nullable().optional(),
  status: z.enum(["active", "archived", "draft"]).optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;