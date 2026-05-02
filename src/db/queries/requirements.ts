import { eq, desc } from "drizzle-orm";
import type { DB } from "../../db/client";
import { requirements, type Requirement, type NewRequirement } from "../schema";
import { newId } from "../../lib/ulid";

export async function createRequirement(
  db: DB,
  data: {
    projectId: string;
    title: string;
    description?: string | null;
    priority?: "low" | "medium" | "high" | "critical";
    status?: "pending" | "in-progress" | "done";
  },
): Promise<Requirement> {
  const id = newId();
  const now = new Date();

  const result = await db
    .insert(requirements)
    .values({
      id,
      projectId: data.projectId,
      title: data.title,
      description: data.description ?? null,
      priority: data.priority ?? "medium",
      status: data.status ?? "pending",
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return result[0]!;
}

export async function getRequirementById(
  db: DB,
  id: string,
): Promise<Requirement | null> {
  const result = await db
    .select()
    .from(requirements)
    .where(eq(requirements.id, id))
    .limit(1);

  return result[0] ?? null;
}

export async function listRequirementsByProject(
  db: DB,
  projectId: string,
  filterStatus?: "pending" | "in-progress" | "done",
): Promise<Requirement[]> {
  let query = db
    .select()
    .from(requirements)
    .where(eq(requirements.projectId, projectId))
    .orderBy(desc(requirements.createdAt));

  if (filterStatus) {
    query = query.where(eq(requirements.status, filterStatus)) as typeof query;
  }

  return query;
}

export async function updateRequirement(
  db: DB,
  id: string,
  data: {
    title?: string;
    description?: string | null;
    priority?: "low" | "medium" | "high" | "critical";
    status?: "pending" | "in-progress" | "done";
  },
): Promise<Requirement> {
  const now = new Date();

  const result = await db
    .update(requirements)
    .set({
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.priority !== undefined && { priority: data.priority }),
      ...(data.status !== undefined && { status: data.status }),
      updatedAt: now,
    })
    .where(eq(requirements.id, id))
    .returning();

  if (!result[0]) {
    throw new Error(`Requirement not found: ${id}`);
  }

  return result[0]!;
}

export async function deleteRequirement(db: DB, id: string): Promise<void> {
  await db.delete(requirements).where(eq(requirements.id, id));
}