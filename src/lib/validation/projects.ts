import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  description: z.string().max(1000).optional(),
  status: z.enum(["active", "archived", "draft"]).default("active"),
});

export const updateProjectSchema = createProjectSchema.omit({}).partial();

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;