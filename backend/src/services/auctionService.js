import { prisma } from "../prisma.js";

// places a bid, returns updated auction and an optional notification object
export async function placeBid({ auctionId, userId, amount }) {
  const auction = await prisma.auction.findUnique({
    where: { id: auctionId },
  });

  if (!auction) {
    throw new Error("Auction not found");
  }

  if (amount <= Number(auction.current_price)) {
    throw new Error("Bid too low");
  }

  if (new Date() > auction.end_at) {
    throw new Error("Auction ended");
  }

  // find previous highest bid (if any)
  const previousHighest = await prisma.bid.findFirst({
    where: { auction_id: auctionId },
    orderBy: { amount: "desc" },
  });

  // create the new bid
  const bid = await prisma.bid.create({
    data: {
      amount,
      auction_id: auctionId,
      user_id: userId,
    },
  });

  // update auction price
  const updatedAuction = await prisma.auction.update({
    where: { id: auctionId },
    data: { current_price: amount },
    include: { images: true, bids: true },
  });

  let notification = null;

  // create notification for previous highest bidder (if different)
  if (previousHighest && previousHighest.user_id !== userId) {
    notification = await prisma.notification.create({
      data: {
        user_id: previousHighest.user_id,
        auction_id: auctionId,
        type: "outbid",
        message: `You were outbid on ${auction.title}`,
        send_email: false,
      },
    });
  }

  return { updatedAuction, bid, notification };
}