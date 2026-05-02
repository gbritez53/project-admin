import { eq, desc } from "drizzle-orm";
import type { DB } from "../../db/client";
import { projects, type Project, type NewProject } from "../schema";
import { newId } from "../../lib/ulid";

export async function createProject(
  db: DB,
  data: { name: string; description?: string | null; status?: "active" | "archived" | "draft" },
): Promise<Project> {
  const id = newId();
  const now = new Date();

  const result = await db
    .insert(projects)
    .values({
      id,
      name: data.name,
      description: data.description ?? null,
      status: data.status ?? "active",
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return result[0]!;
}

export async function getProjectById(
  db: DB,
  id: string,
): Promise<Project | null> {
  const result = await db
    .select()
    .from(projects)
    .where(eq(projects.id, id))
    .limit(1);

  return result[0] ?? null;
}

export async function listProjects(db: DB): Promise<Project[]> {
  return db
    .select()
    .from(projects)
    .orderBy(desc(projects.createdAt));
}

export async function listProjectsByStatus(
  db: DB,
  status: "active" | "archived" | "draft",
): Promise<Project[]> {
  return db
    .select()
    .from(projects)
    .where(eq(projects.status, status))
    .orderBy(desc(projects.createdAt));
}

export async function updateProject(
  db: DB,
  id: string,
  data: {
    name?: string;
    description?: string | null;
    status?: "active" | "archived" | "draft";
  },
): Promise<Project> {
  const now = new Date();

  const result = await db
    .update(projects)
    .set({
      ...(data.name !== undefined && { name: data.name }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.status !== undefined && { status: data.status }),
      updatedAt: now,
    })
    .where(eq(projects.id, id))
    .returning();

  if (!result[0]) {
    throw new Error(`Project not found: ${id}`);
  }

  return result[0]!;
}

export async function deleteProject(db: DB, id: string): Promise<void> {
  await db.delete(projects).where(eq(projects.id, id));
}