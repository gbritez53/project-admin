import { describe, it, expect, beforeEach } from "vitest";
import { makeTestDb, type TestDb } from "../../lib/test-db";
import * as projects from "../queries/projects";
import { projects as projectsTable } from "../schema";

describe("projects", () => {
  let db: TestDb;

  beforeEach(async () => {
    const testDb = await makeTestDb();
    db = testDb.db;
  });

  describe("createProject", () => {
    it("creates a project with required fields", async () => {
      const result = await projects.createProject(db, {
        name: "Test Project",
      });

      expect(result).toBeDefined();
      expect(result.id).toHaveLength(26); // ULID length
      expect(result.name).toBe("Test Project");
      expect(result.status).toBe("active");
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });

    it("creates a project with optional description", async () => {
      const result = await projects.createProject(db, {
        name: "Test Project",
        description: "A description",
      });

      expect(result.description).toBe("A description");
    });

    it("creates a project with explicit status", async () => {
      const result = await projects.createProject(db, {
        name: "Draft Project",
        status: "draft",
      });

      expect(result.status).toBe("draft");
    });
  });

  describe("getProjectById", () => {
    it("returns null for non-existent id", async () => {
      const result = await projects.getProjectById(db, "nonexistent-id");
      expect(result).toBeNull();
    });

    it("returns project when found", async () => {
      const created = await projects.createProject(db, { name: "Test" });
      const result = await projects.getProjectById(db, created.id);

      expect(result).not.toBeNull();
      expect(result!.id).toBe(created.id);
      expect(result!.name).toBe("Test");
    });
  });

  describe("listProjects", () => {
    it("returns empty array when no projects", async () => {
      const result = await projects.listProjects(db);
      expect(result).toEqual([]);
    });

    it("returns projects sorted by createdAt desc (newest first)", async () => {
      // Create in known order
      const p1 = await projects.createProject(db, { name: "First" });
      await new Promise((r) => setTimeout(r, 10)); // Ensure different timestamps
      const p2 = await projects.createProject(db, { name: "Second" });

      const result = await projects.listProjects(db);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(p2.id); // newest first
      expect(result[1].id).toBe(p1.id);
    });
  });

  describe("listProjectsByStatus", () => {
    it("filters by status", async () => {
      await projects.createProject(db, { name: "Active 1", status: "active" });
      await projects.createProject(db, { name: "Draft", status: "draft" });
      await projects.createProject(db, { name: "Archived", status: "archived" });
      await projects.createProject(db, { name: "Active 2", status: "active" });

      const active = await projects.listProjectsByStatus(db, "active");
      const draft = await projects.listProjectsByStatus(db, "draft");
      const archived = await projects.listProjectsByStatus(db, "archived");

      expect(active).toHaveLength(2);
      expect(draft).toHaveLength(1);
      expect(archived).toHaveLength(1);
    });
  });

  describe("updateProject", () => {
    it("updates name and updatedAt", async () => {
      const original = await projects.createProject(db, { name: "Original" });
      const originalUpdatedAt = original.updatedAt;

      await new Promise((r) => setTimeout(r, 10)); // Ensure time passes

      const updated = await projects.updateProject(db, original.id, {
        name: "Updated Name",
      });

      expect(updated.name).toBe("Updated Name");
      expect(updated.id).toBe(original.id);
      expect(updated.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });

    it("updates description to null when cleared", async () => {
      const original = await projects.createProject(db, {
        name: "Test",
        description: "has desc",
      });

      const updated = await projects.updateProject(db, original.id, {
        description: null,
      });

      expect(updated.description).toBeNull();
    });
  });

  describe("deleteProject", () => {
    it("deletes a project", async () => {
      const created = await projects.createProject(db, { name: "To Delete" });

      await projects.deleteProject(db, created.id);

      const result = await projects.getProjectById(db, created.id);
      expect(result).toBeNull();
    });
  });
});