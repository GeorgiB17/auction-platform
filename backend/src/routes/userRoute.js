import express from "express";
import { prisma } from "../prisma.js";

export const router = express.Router();

router.get("/bids", async (req, res) => {
  try {
    const bids = await prisma.bid.findMany({
      where: {
        user_id: req.user.id,
      },
      orderBy: {
        created_at: "desc",
      },
      include: {
        auction: {
          select: {
            id: true,
            title: true,
            current_price: true,
            end_at: true,
            images: {
              select: { url: true },
              take: 1,
            },
          },
        },
      },
    });

    const formattedBids = bids.map((bid) => ({
      id: bid.id,
      amount: Number(bid.amount),
      createdAt: bid.created_at.toISOString(),
      auctionId: bid.auction.id,
      auctionTitle: bid.auction.title,
      auctionCurrentPrice: Number(bid.auction.current_price),
      auctionEndAt: bid.auction.end_at.toISOString(),
      auctionImage: bid.auction.images[0]?.url ?? null,
    }));

    res.json({ bids: formattedBids });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch bids" });
  }
});
