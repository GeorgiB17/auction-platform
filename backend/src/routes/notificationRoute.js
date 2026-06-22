import express from "express";
import { prisma } from "../prisma.js";

export const router = express.Router();

// Get recent notifications for current user
router.get("/", async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { user_id: req.user.id },
      orderBy: { created_at: "desc" },
      include: { auction: true },
      take: 50,
    });

    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

// Mark single notification as read
router.patch("/:id/read", async (req, res) => {
  try {
    const { id } = req.params;

    const notif = await prisma.notification.updateMany({
      where: { id, user_id: req.user.id },
      data: { is_read: true },
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to mark as read" });
  }
});

// Mark all as read
router.patch("/read-all", async (req, res) => {
  try {
    await prisma.notification.updateMany({
      where: { user_id: req.user.id, is_read: false },
      data: { is_read: true },
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to mark all as read" });
  }
});

export default router;
