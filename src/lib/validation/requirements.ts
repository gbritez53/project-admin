import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import { requirements } from "../../db/schema";

const base = createInsertSchema(requirements, {
  title: (s) => s.min(1).max(200),
  description: (s) => s.max(2000).optional(),
  priority: (s) => s.enum(["low", "medium", "high", "critical"]),
  status: (s) => s.enum(["pending", "in-progress", "done"]),
});

export const createRequirementSchema = base.omit({
  id: true,
  projectId: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  projectId: z.string().min(1),
});

export const updateRequirementSchema = createRequirementSchema.partial().extend({
  projectId: z.string().min(1).optional(),
});

export type CreateRequirementInput = z.infer<typeof createRequirementSchema>;
export type UpdateRequirementInput = z.infer<typeof updateRequirementSchema>;