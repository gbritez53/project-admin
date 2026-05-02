import { z } from "zod";

export const createRequirementSchema = z.object({
  projectId: z.string().min(1, "Project ID is required"),
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(2000).optional(),
  priority: z.enum(["low", "medium", "high", "critical"]).default("medium"),
  status: z.enum(["pending", "in-progress", "done"]).default("pending"),
});

export const updateRequirementSchema = createRequirementSchema.omit({ projectId: true }).partial();

export type CreateRequirementInput = z.infer<typeof createRequirementSchema>;
export type UpdateRequirementInput = z.infer<typeof updateRequirementSchema>;