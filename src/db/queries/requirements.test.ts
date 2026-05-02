import { describe, it, expect, beforeEach } from "vitest";
import { makeTestDb, type TestDb } from "../../lib/test-db";
import * as requirements from "../queries/requirements";
import * as projects from "../queries/projects";

describe("requirements", () => {
  let db: TestDb;

  beforeEach(async () => {
    const testDb = await makeTestDb();
    db = testDb.db;
  });

  describe("createRequirement", () => {
    it("creates a requirement with required fields", async () => {
      const project = await projects.createProject(db, { name: "Test Project" });

      const result = await requirements.createRequirement(db, {
        projectId: project.id,
        title: "Test Requirement",
      });

      expect(result).toBeDefined();
      expect(result.id).toHaveLength(26);
      expect(result.projectId).toBe(project.id);
      expect(result.title).toBe("Test Requirement");
      expect(result.status).toBe("pending");
      expect(result.priority).toBe("medium");
    });

    it("creates a requirement with optional fields", async () => {
      const project = await projects.createProject(db, { name: "Test" });

      const result = await requirements.createRequirement(db, {
        projectId: project.id,
        title: "High Priority",
        priority: "high",
        status: "in-progress",
        description: "A description",
      });

      expect(result.priority).toBe("high");
      expect(result.status).toBe("in-progress");
      expect(result.description).toBe("A description");
    });

    it("throws on invalid projectId (FK violation)", async () => {
      await expect(
        requirements.createRequirement(db, {
          projectId: "fake-id",
          title: "Test",
        }),
      ).rejects.toThrow();
    });
  });

  describe("listRequirementsByProject", () => {
    it("returns empty array when no requirements", async () => {
      const project = await projects.createProject(db, { name: "Test" });
      const result = await requirements.listRequirementsByProject(db, project.id);
      expect(result).toEqual([]);
    });

    it("returns requirements sorted by createdAt desc (newest first)", async () => {
      const project = await projects.createProject(db, { name: "Test" });

      const r1 = await requirements.createRequirement(db, {
        projectId: project.id,
        title: "First",
      });
      await new Promise((r) => setTimeout(r, 10));
      const r2 = await requirements.createRequirement(db, {
        projectId: project.id,
        title: "Second",
      });

      const result = await requirements.listRequirementsByProject(db, project.id);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(r2.id);
      expect(result[1].id).toBe(r1.id);
    });

    it("filters by status when provided", async () => {
      const project = await projects.createProject(db, { name: "Test" });

      await requirements.createRequirement(db, {
        projectId: project.id,
        title: "Pending 1",
        status: "pending",
      });
      await requirements.createRequirement(db, {
        projectId: project.id,
        title: "Done",
        status: "done",
      });
      await requirements.createRequirement(db, {
        projectId: project.id,
        title: "Pending 2",
        status: "pending",
      });

      const pending = await requirements.listRequirementsByProject(db, project.id, "pending");
      const done = await requirements.listRequirementsByProject(db, project.id, "done");

      expect(pending).toHaveLength(2);
      expect(done).toHaveLength(1);
    });
  });

  describe("updateRequirement", () => {
    it("updates status and bumps updatedAt", async () => {
      const project = await projects.createProject(db, { name: "Test" });
      const req = await requirements.createRequirement(db, {
        projectId: project.id,
        title: "Test",
        status: "pending",
      });

      const originalUpdatedAt = req.updatedAt;
      await new Promise((r) => setTimeout(r, 10));

      const updated = await requirements.updateRequirement(db, req.id, {
        status: "in-progress",
      });

      expect(updated.status).toBe("in-progress");
      expect(updated.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });

    it("updates multiple fields", async () => {
      const project = await projects.createProject(db, { name: "Test" });
      const req = await requirements.createRequirement(db, {
        projectId: project.id,
        title: "Original",
      });

      const updated = await requirements.updateRequirement(db, req.id, {
        title: "Updated",
        priority: "critical",
      });

      expect(updated.title).toBe("Updated");
      expect(updated.priority).toBe("critical");
    });
  });

  describe("deleteRequirement", () => {
    it("deletes a requirement", async () => {
      const project = await projects.createProject(db, { name: "Test" });
      const req = await requirements.createRequirement(db, {
        projectId: project.id,
        title: "To Delete",
      });

      await requirements.deleteRequirement(db, req.id);

      const result = await requirements.getRequirementById(db, req.id);
      expect(result).toBeNull();
    });
  });

  describe("getRequirementById", () => {
    it("returns null for non-existent id", async () => {
      const result = await requirements.getRequirementById(db, "nonexistent");
      expect(result).toBeNull();
    });

    it("returns requirement when found", async () => {
      const project = await projects.createProject(db, { name: "Test" });
      const req = await requirements.createRequirement(db, {
        projectId: project.id,
        title: "Test",
      });

      const result = await requirements.getRequirementById(db, req.id);
      expect(result).not.toBeNull();
      expect(result!.id).toBe(req.id);
    });
  });
});