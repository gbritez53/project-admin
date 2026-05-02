import type { APIRoute } from "astro";
import { db } from "../../../db/client";
import { getProjectById, updateProject, deleteProject } from "../../../db/queries/projects";
import { updateProjectSchema } from "../../../lib/validation/projects";

export const prerender = false;

export const PATCH: APIRoute = async ({ params, request, redirect }) => {
  const { id } = params;
  if (!id) {
    return redirect("/?error=missing_id", 303);
  }

  const existing = await getProjectById(db, id);
  if (!existing) {
    return redirect(`/?error=not_found`, 303);
  }

  const form = await request.formData();
  const raw = Object.fromEntries(form.entries());

  // Handle _method override for form-based PATCH
  const method = raw._method as string | undefined;
  if (method && method.toLowerCase() !== "patch") {
    return redirect(`/projects/${id}/edit?error=invalid_method`, 303);
  }

  const parsed = updateProjectSchema.safeParse({
    name: raw.name || undefined,
    description: raw.description === "" ? null : (raw.description as string | undefined),
    status: (raw.status as "active" | "archived" | "draft") || undefined,
  });

  if (!parsed.success) {
    const issues = parsed.error.issues;
    const firstIssue = issues[0];
    const path = firstIssue?.path?.join(".") || "field";
    const message = firstIssue?.message || "Invalid input";
    return redirect(`/projects/${id}/edit?error=${path}:${encodeURIComponent(message)}`, 303);
  }

  await updateProject(db, id, parsed.data);

  return redirect(`/projects/${id}`, 303);
};

export const DELETE: APIRoute = async ({ params, redirect }) => {
  const { id } = params;
  if (!id) {
    return redirect("/?error=missing_id", 303);
  }

  const existing = await getProjectById(db, id);
  if (!existing) {
    return redirect(`/?error=not_found`, 303);
  }

  // Handle _method override for form-based DELETE
  const method = "_method";
  
  await deleteProject(db, id);

  return redirect("/", 303);
};