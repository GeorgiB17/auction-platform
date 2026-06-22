import express from "express";
import { auth } from "../services/authService.js";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

function serializeAuction(auction) {
  return {
    id: auction.id,
    title: auction.title,
    description: auction.description,
    startPrice: Number(auction.start_price),
    currentPrice: Number(auction.current_price),
    yearPurchased: auction.year_purchased,
    endAt: auction.end_at ? auction.end_at.toISOString() : null,
    isDeleted: auction.is_deleted,
    isHidden: auction.is_hidden,
    createdAt: auction.created_at?.toISOString?.() ?? null,
    updatedAt: auction.updated_at?.toISOString?.() ?? null,
    createdBy: auction.created_by?.username ?? null,
    images: auction.images?.map((image) => ({
      id: image.id,
      url: image.url,
    })) ?? [],
  };
}

router.get("/", (req, res) => {
  res.send("Admin-Seite");
});

router.get("/auctions", async (req, res) => {
  try {
    const auctions = await prisma.auction.findMany({
      include: {
        images: true,
        created_by: {
          select: { username: true }
        }
      },
      orderBy: {
        created_at: 'desc' // Newest first
      }
    });
    res.json(auctions.map(serializeAuction));
  } catch (err) {
    console.error("Error fetching auctions:", err);
    res.status(500).json({ error: "Failed to fetch auctions" });
  }
});

router.get("/auctions/:id", async (req, res) => {
  try {
    const auction = await prisma.auction.findUnique({
      where: { id: req.params.id },
      include: {
        images: true,
        created_by: {
          select: { username: true },
        },
      },
    });

    if (!auction) {
      return res.status(404).json({ error: "Auction not found" });
    }

    console.log("Fetched auction:", auction);

    return res.json({ auction: serializeAuction(auction) });
  } catch (err) {
    console.error("Error fetching auction:", err);
    return res.status(500).json({ error: "Failed to fetch auction" });
  }
});

router.patch("/auctions/:id", async (req, res) => {
  try {
    const existingAuction = await prisma.auction.findUnique({
      where: { id: req.params.id },
    });

    if (!existingAuction) {
      return res.status(404).json({ success: false, message: "Auction not found" });
    }

    console.log("Received update data:", req.body);

    const {
      title,
      description,
      startingPrice,
      yearPurchased,
      endAt,
      hide,
    } = req.body;

    const data = {};

    if (typeof title === "string") {
      data.title = title.trim();
    }

    if (typeof description === "string") {
      data.description = description.trim();
    }

    if (startingPrice !== undefined && startingPrice !== "") {
      const parsedPrice = Number.parseFloat(startingPrice);

      data.start_price = parsedPrice;
      data.current_price = Math.max(
        parsedPrice,
        Number(existingAuction.current_price),
      );
    }

    if (yearPurchased !== undefined && yearPurchased !== "") {
      data.year_purchased = Number.parseInt(yearPurchased, 10);
    }

    if (endAt) {
      data.end_at = new Date(endAt);
    }

    if (hide !== undefined) {
      data.is_hidden =
        typeof hide === "string"
          ? hide === "true"
          : Boolean(hide);
    }

    const updatedAuction = await prisma.auction.update({
      where: {
        id: req.params.id,
      },
      data,
      include: {
        images: true,
        created_by: {
          select: {
            username: true,
          },
        },
      },
    });

    console.log("Updated auction:", updatedAuction);

    return res.json({ success: true, auction: serializeAuction(updatedAuction) });
  } catch (err) {
    console.error("Error updating auction:", err);
    return res.status(500).json({ success: false, message: "Failed to update auction" });
  }
});

router.delete("/delete-auction/:id", async (req, res) => {
  const auctionId = req.params.id;

  if (!auctionId) {
    return res.status(400).json({ success: false, message: "Auction id is required" });
  }

  try {
    const auction = await prisma.auction.findUnique({
      where: { id: auctionId }
    });

    if (!auction) {
      return res.status(404).json({ success: false, message: "Auction not found" });
    }

    await prisma.auction.update({
      where: { id: auctionId },
      data: { is_deleted: true }
    });

    return res.json({ success: true, message: "Auction deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Fehler beim Löschen der Auktion" });
  }
});

router.post("/create-auction", upload.any(), async (req, res) => {
  console.log("Received req.body:", req.body);
  console.log("Received req.files:", req.files);
  
  const { auctionTitle, auctionDescription, startingPrice, yearPurchased, endDate, hide } = req.body;
  
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Nicht authentifiziert" });
    }

    const decoded = jwt.verify(token, "secret_key"); //add secret key to env
    const username = decoded.username;
    const user = await prisma.user.findUnique({ where: { username } });
    
    // Create the auction
    const auction = await prisma.auction.create({
      data: {
        title: auctionTitle,
        description: auctionDescription,
        start_price: parseFloat(startingPrice),
        current_price: parseFloat(startingPrice),
        year_purchased: parseInt(yearPurchased),
        end_at: new Date(endDate),
        is_hidden: hide === 'true',
        created_by: {
            connect: {
                id: user.id
            }
        }
      },
    });

    // Handle image uploads - filter for auctionImages field
    const auctionImages = req.files ? req.files.filter(file => file.fieldname === 'auctionImages') : [];
    if (auctionImages.length > 0) {
      const imagePromises = auctionImages.map((file) => {
        const imageUrl = `/uploads/${file.filename}`;
        return prisma.image.create({
          data: {
            url: imageUrl,
            auction_id: auction.id
          }
        });
      });
      
      await Promise.all(imagePromises);
    }

    return res.json({ success: true, auction });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Fehler beim Erstellen der Auktion" });
  }
});