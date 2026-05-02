import type { APIRoute } from "astro";
import { getDbInstance } from "../../../db/client";

export const prerender = false;

export const POST: APIRoute = async ({ request, redirect, locals }) => {
  try {
    // @ts-ignore - db passed from middleware
    const db = locals.db || getDbInstance();
    
    const form = await request.formData();
    const name = String(form.get("name") || "").trim();
    const description = String(form.get("description") || "").trim() || undefined;
    const status = String(form.get("status") || "active") as "active" | "archived" | "draft";

    if (!name) {
      return redirect(`/projects/new?error=name:Name is required`, 303);
    }

    if (name.length > 120) {
      return redirect(`/projects/new?error=name:Name must be 120 characters or less`, 303);
    }

    const validStatuses = ["active", "archived", "draft"];
    if (!validStatuses.includes(status)) {
      return redirect(`/projects/new?error=status:Invalid status`, 303);
    }

    // Dynamic import
    const { createProject } = await import("../../../db/queries/projects");
    
    const project = await createProject(db, {
      name,
      description: description || null,
      status,
    });

    return redirect(`/projects/${project.id}`, 303);
  } catch (error) {
    console.error("Create project error:", error);
    return redirect(`/projects/new?error=server:Failed to create project`, 303);
  }
};