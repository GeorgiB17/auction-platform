import express from "express";
import { prisma } from "../prisma.js";
import { io } from "../socket.js";
import { placeBid } from "../services/auctionService.js";

export const router = express.Router();

router.get("/", async (req, res) => {
  try {

    const auctions = await prisma.auction.findMany({
      select: {
        id: true,
        title: true,
        current_price: true,
        end_at: true,

        images: {
          select: { url: true },
          take: 1,
        },

        _count: {
          select: { bids: true },
        },
      },

      where: {
        is_hidden: false,
        is_deleted: false,
      },

      orderBy: {
        created_at: "desc",
      },
    });

    const formatted = auctions.map((item) => ({
      id: item.id,
      title: item.title,
      image: item.images[0]?.url ?? null,

      currentPrice: item.current_price.toNumber(),
      bids: item._count.bids,

      endAt: item.end_at.toISOString(),
    }));

    res.json(formatted);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Failed to fetch auctions",
    });

  }
});

router.get("/:auctionId", async (req, res) => {

  const { auctionId } = req.params;

  try {

    const auction = await prisma.auction.findUnique({
      where: {
        id: auctionId,
      },

      include: {
        images: true,

        bids: {
          orderBy: {
            amount: "desc",
          },

          include: {
            user: true,
          },
        },
      },
    });

    if (!auction) {
      return res.status(404).json({
        error: "Auction not found",
      });
    }

    res.json({
      auction,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Failed to fetch auction details",
    });

  }
});

router.post("/:auctionId/bids", async (req, res) => {

  try {

    const { auctionId } = req.params;
    const { amount } = req.body;

    const numericAmount = parseFloat(amount);

    const auction = await prisma.auction.findUnique({
      where: {
        id: auctionId,
      },
    });

    if (!auction) {
      return res.status(404).json({
        error: "Auction not found",
      });
    }

    if (numericAmount <= Number(auction.current_price)) {
      return res.status(400).json({
        error: "Bid must be higher than current price",
      });
    }

    if (new Date() > auction.end_at) {
      return res.status(400).json({
        error: "Auction has already ended",
      });
    }

    const result = await placeBid({
      auctionId,
      userId: req.user.id,
      amount: numericAmount,
    });

    // emit auction update to auction room
    io.to(`auction:${auctionId}`).emit("auctionUpdated", result.updatedAuction);

    // emit notification to previous highest bidder (if any)
    if (result.notification) {
      io.to(`user:${result.notification.user_id}`).emit(
        "notification:received",
        result.notification,
      );
    }

    res.status(201).json({ message: "Bid placed successfully", bid: result.bid });
  } catch (err) {
    console.error(err);

    if (err instanceof Error && ["Auction not found", "Bid too low", "Auction ended"].includes(err.message)) {
      return res.status(400).json({ error: err.message });
    }

    res.status(500).json({
      error: "Internal server error",
    });
  }
});