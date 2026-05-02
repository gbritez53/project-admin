import type { APIRoute } from "astro";
import { db } from "../../../db/client";
import {
  getRequirementById,
  updateRequirement,
  deleteRequirement,
} from "../../../db/queries/requirements";
import { updateRequirementSchema } from "../../../lib/validation/requirements";

export const prerender = false;

export const PATCH: APIRoute = async ({ params, request, redirect }) => {
  const { id } = params;
  if (!id) {
    return redirect("/?error=missing_id", 303);
  }

  const existing = await getRequirementById(db, id);
  if (!existing) {
    return redirect(`/?error=not_found`, 303);
  }

  const form = await request.formData();
  const raw = Object.fromEntries(form.entries());

  const parsed = updateRequirementSchema.safeParse({
    title: raw.title || undefined,
    description: raw.description === "" ? null : (raw.description as string | undefined),
    priority: (raw.priority as "low" | "medium" | "high" | "critical") || undefined,
    status: (raw.status as "pending" | "in-progress" | "done") || undefined,
  });

  if (!parsed.success) {
    const issues = parsed.error.issues;
    const firstIssue = issues[0];
    const path = firstIssue?.path?.join(".") || "field";
    const message = firstIssue?.message || "Invalid input";
    return redirect(
      `/projects/${existing.projectId}?error=${path}:${encodeURIComponent(message)}#requirements`,
      303,
    );
  }

  await updateRequirement(db, id, parsed.data);

  return redirect(`/projects/${existing.projectId}#requirements`, 303);
};

export const DELETE: APIRoute = async ({ params, redirect }) => {
  const { id } = params;
  if (!id) {
    return redirect("/?error=missing_id", 303);
  }

  const existing = await getRequirementById(db, id);
  if (!existing) {
    return redirect(`/?error=not_found`, 303);
  }

  const projectId = existing.projectId;
  await deleteRequirement(db, id);

  return redirect(`/projects/${projectId}#requirements`, 303);
};