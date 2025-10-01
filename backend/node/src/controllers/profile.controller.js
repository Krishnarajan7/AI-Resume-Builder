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
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ message: "Server error fetching profile" });
  }
};

/* Update user's profile (name)
   Username is read-only */
export const updateProfile = async (req, res) => {
  try {
    const { full_name } = req.body;

    if (!full_name || full_name.trim() === "") {
      return res.status(400).json({ message: "Full name is required" });
    }

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { name: full_name.trim() },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Server error updating profile" });
  }
};

/* Update user's password */
export const updatePassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

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
