import { placeBid } from "../../services/auctionService.js";

export function registerBidHandlers(io, socket) {
  socket.on("placeBid", async (data) => {
    try {
      const result = await placeBid({
        auctionId: data.auctionId,
        amount: parseFloat(data.amount),
        userId: socket.userId,
      });

      const room = `auction:${data.auctionId}`;

      io.to(room).emit("auctionUpdated", result.updatedAuction);

      // emit notification to previous highest bidder if created
      if (result.notification) {
        io.to(`user:${result.notification.user_id}`).emit(
          "notification:received",
          result.notification,
        );
      }

      socket.emit("bidSuccess", { message: "Bid placed successfully!" });

    } catch (error) {
      socket.emit("bidError", {
        message: error.message,
      });
    }
  });
}