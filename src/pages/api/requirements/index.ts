import type { APIRoute } from "astro";
import { db } from "../../../db/client";
import { createRequirement } from "../../../db/queries/requirements";
import { createRequirementSchema } from "../../../lib/validation/requirements";

export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const raw = Object.fromEntries(form.entries());

  const parsed = createRequirementSchema.safeParse({
    projectId: raw.projectId,
    title: raw.title,
    description: raw.description || undefined,
    priority: (raw.priority as "low" | "medium" | "high" | "critical") || "medium",
    status: (raw.status as "pending" | "in-progress" | "done") || "pending",
  });

  if (!parsed.success) {
    const issues = parsed.error.issues;
    const firstIssue = issues[0];
    const path = firstIssue?.path?.join(".") || "field";
    const message = firstIssue?.message || "Invalid input";
    return redirect(
      `/projects/${raw.projectId}?error=${path}:${encodeURIComponent(message)}#requirements`,
      303,
    );
  }

  const requirement = await createRequirement(db, parsed.data);

  return redirect(
    `/projects/${requirement.projectId}#requirements`,
    303,
  );
};