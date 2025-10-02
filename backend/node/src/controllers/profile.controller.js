import bcrypt from "bcryptjs";
import prisma from "../config/db.js";

/* Get current user's profile */
export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        emailVerified: true,

        // Extended profile fields
        job_title: true,
        company: true,
        industry: true,
        phone_number: true,
        location: true,
        website_url: true,
        linkedin_url: true,
        github_url: true,
        professional_summary: true,
        years_experience: true,
        career_level: true,
        avatar_url: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Map `name` to `full_name` for frontend
    res.json({
      ...user,
      full_name: user.name,
    });
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ message: "Server error fetching profile" });
  }
};

/* Update user's profile
   (email + username = read-only) */
export const updateProfile = async (req, res) => {
  try {
    const {
      name,
      job_title,
      company,
      industry,
      phone_number,
      location,
      website_url,
      linkedin_url,
      github_url,
      professional_summary,
      years_experience,
      career_level,
      avatar_url,
    } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name,
        job_title,
        company,
        industry,
        phone_number,
        location,
        website_url,
        linkedin_url,
        github_url,
        professional_summary,
        years_experience,
        career_level,
        avatar_url,
      },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,

        // Return profile fields
        job_title: true,
        company: true,
        industry: true,
        phone_number: true,
        location: true,
        website_url: true,
        linkedin_url: true,
        github_url: true,
        professional_summary: true,
        years_experience: true,
        career_level: true,
        avatar_url: true,
      },
    });
    res.json({ message: "Profile updated successfully", user: { ...updatedUser, full_name: updatedUser.name } });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Server error updating profile" });
  }
};

/* Update user's password */
export const updatePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const authProvider = await prisma.authProvider.updateMany({
      where: { userId: req.user.id, provider: "email" },
      data: { passwordHash: hashedPassword },
    });

    if (authProvider.count === 0) {
      return res
        .status(404)
        .json({ message: "Email provider not found for this user" });
    }

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Update password error:", err);
    res.status(500).json({ message: "Server error updating password" });
  }
};
