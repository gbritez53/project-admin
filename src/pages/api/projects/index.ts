import type { APIRoute } from "astro";
import { db } from "../../../db/client";
import { createProject } from "../../../db/queries/projects";
import { createProjectSchema } from "../../../lib/validation/projects";

export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const raw = Object.fromEntries(form.entries());

  const parsed = createProjectSchema.safeParse({
    name: raw.name,
    description: raw.description || undefined,
    status: (raw.status as "active" | "archived" | "draft") || "active",
  });

  if (!parsed.success) {
    const issues = parsed.error.issues;
    const firstIssue = issues[0];
    const path = firstIssue?.path?.join(".") || "field";
    const message = firstIssue?.message || "Invalid input";
    return redirect(`/projects/new?error=${path}:${encodeURIComponent(message)}`, 303);
  }

  const project = await createProject(db, parsed.data);

  return redirect(`/projects/${project.id}`, 303);
};