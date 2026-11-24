import User from "../models/User.js";
import { asyncHandler } from "../middleware/errorMiddleware.js";

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-passwordHash");
  res.status(200).json(users);
});

export const updateUserRole = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { role } = req.body || {};

    if (!["admin", "editor", "viewer"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (req.user._id.toString() === id) {
      return res
        .status(400)
        .json({ message: "You cannot change your own role" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      message: "User role updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
});

export const updateUserStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body || {};

    if (!["active", "banned"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    if (req.user._id.toString() === id) {
      return res
        .status(400)
        .json({ message: "You cannot change your own status" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.status = status;
    await user.save();

    res.status(200).json({
      message: `User ${status} successfully`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
});
