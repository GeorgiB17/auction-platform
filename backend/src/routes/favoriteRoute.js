import express from "express";
import { prisma } from "../prisma.js";

export const router = express.Router();

// Toggle favorite for an auction
router.post("/:auctionId", async (req, res) => {
  try {
    const { auctionId } = req.params;
    const userId = req.user.id;

    const existing = await prisma.favorite.findFirst({
      where: { user_id: userId, auction_id: auctionId },
    });

    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } });
      return res.json({ favorited: false });
    }

    const fav = await prisma.favorite.create({
      data: { user_id: userId, auction_id: auctionId },
    });

    res.json({ favorited: true, favorite: fav });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to toggle favorite" });
  }
});

// Check favorite status for current user
router.get("/:auctionId", async (req, res) => {
  try {
    const { auctionId } = req.params;
    const userId = req.user.id;

    const existing = await prisma.favorite.findFirst({
      where: { user_id: userId, auction_id: auctionId },
    });

    res.json({ favorited: !!existing });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to check favorite" });
  }
});

// List all favorite auctions for current user
router.get("/", async (req, res) => {
  try {
    const userId = req.user.id;

    const favs = await prisma.favorite.findMany({
      where: { user_id: userId },
      include: { auction: true },
    });

    res.json(favs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

export default router;
