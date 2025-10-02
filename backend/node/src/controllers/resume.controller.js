import prisma from "../config/db.js";
import * as AI from "../helpers/openai.js";

/* ---------------- Resume CRUD ---------------- */

/* Get all resumes for current user */
export const getResumes = async (req, res) => {
  try {
    const resumes = await prisma.resume.findMany({
      where: { userId: req.user.id },
      orderBy: { updatedAt: "desc" },
    });
    res.json(resumes);
  } catch (err) {
    console.error("Get resumes error:", err);
    res.status(500).json({ message: "Server error fetching resumes" });
  }
};

/* Get single resume by ID (ownership enforced in query) */
export const getResumeById = async (req, res) => {
  try {
    const { id } = req.params;

    const resume = await prisma.resume.findUnique({
      where: {
        id_userId: {
          id,
          userId: req.user.id, //ensures resume belongs to current user
        },
      },
    });

    if (!resume) {
      return res
        .status(404)
        .json({ message: "Resume not found or not authorized" });
    }

    res.json(resume);
  } catch (err) {
    console.error("Get resume error:", err);
    res
      .status(500)
      .json({ message: "Server error fetching resume: " + err.message });
  }
};

/* Create resume (fast, DB only) */
export const createResume = async (req, res) => {
  try {
    const {
      title,
      content,
      tailoredFor,
      summary,
      bullets,
      suggestedSkills,
      enhancedSections,
    } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    const resume = await prisma.resume.create({
      data: {
        title,
        content,
        tailoredFor,
        userId: req.user.id,
        summary: summary || null,
        bullets: bullets || [],
        suggestedSkills: suggestedSkills || [],
        enhancedSections: enhancedSections || [], // Save AI-enhanced sections
      },
    });

    res.status(201).json({ message: "Resume created successfully", resume });
  } catch (err) {
    console.error("Create resume error:", err);
    res.status(500).json({ message: "Server error creating resume" });
  }
};

/* Update resume */
export const updateResume = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const updates = req.body;

    Object.keys(updates).forEach(
      (key) => (updates[key] === undefined || updates[key] === "") && delete updates[key]
    );

    // Ensure resume belongs to the logged-in user
    const existingResume = await prisma.resume.findUnique({
      where: {
        id_userId: {
          id: id,
          userId: userId,
        },
      },
    });

    if (!existingResume) {
      return res.status(404).json({ message: "Resume not found or unauthorized" });
    }

    // Update only the provided fields
    const updatedResume = await prisma.resume.update({
      where: {
        id_userId: {
          id: id,
          userId: userId,
        },
      },
      data: updates,
    });

    res.json(updatedResume);
  } catch (error) {
    console.error("Error updating resume:", error);
    res.status(500).json({ message: "Failed to update resume" });
  }
};

/* Delete resume */
export const deleteResume = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedResume = await prisma.resume.delete({
      where: {
        id_userId: {
          id,
          userId: req.user.id, // ensures only the owner can delete
        },
      },
    });

    res.json({ message: "Resume deleted successfully", resume: deletedResume });
  } catch (err) {
    if (err.code === "P2025") {
      // Prisma error: record not found
      return res
        .status(404)
        .json({ message: "Resume not found or not authorized" });
    }
    console.error("Delete resume error:", err);
    res
      .status(500)
      .json({ message: "Server error deleting resume: " + err.message });
  }
};

/* ---------------- AI Endpoints ---------------- */

/* Enhance summary */
export const enhanceSummaryField = async (req, res) => {
  try {
    const { summary, userPrompt } = req.body;
    if (!summary)
      return res.status(400).json({ message: "Summary text is required" });

    const enhanced = await AI.enhanceSummary(summary, userPrompt || "");
    res.json({ original: summary, enhanced });
  } catch (err) {
    console.error("AI enhance summary error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* Improve bullets */
export const improveBulletField = async (req, res) => {
  try {
    const { bullets, userPrompt } = req.body;
    if (!Array.isArray(bullets) || bullets.length === 0)
      return res
        .status(400)
        .json({ message: "Bullets must be a non-empty array" });

    const improved = await AI.improveBullets(bullets, userPrompt || "");
    res.json({ original: bullets, improved });
  } catch (err) {
    console.error("AI improve bullets error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* Suggest skills */
export const suggestSkillsField = async (req, res) => {
  try {
    const { currentSkills, userPrompt } = req.body;
    if (!Array.isArray(currentSkills))
      return res
        .status(400)
        .json({ message: "Current skills must be an array" });

    const suggested = await AI.suggestSkills(currentSkills, userPrompt || "");
    res.json({ currentSkills, suggested });
  } catch (err) {
    console.error("AI suggest skills error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* Enhance multiple sections */
export const enhanceSectionsField = async (req, res) => {
  try {
    const { sections, userPrompt } = req.body;
    if (!Array.isArray(sections) || sections.length === 0)
      return res
        .status(400)
        .json({ message: "Sections must be a non-empty array" });

    const enhancedSections = await AI.enhanceSections(
      sections,
      userPrompt || ""
    );
    res.json({ enhancedSections });
  } catch (err) {
    console.error("AI enhance sections error:", err);
    res.status(500).json({ message: err.message });
  }
};
