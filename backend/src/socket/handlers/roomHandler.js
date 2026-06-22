export function registerRoomHandlers(socket) {
  socket.on("joinAuction", (auctionId) => {
    socket.join(`auction:${auctionId}`);

    console.log(
      `${socket.id} joined auction:${auctionId}`,
    );
  });

  socket.on("leaveAuction", (auctionId) => {
    socket.leave(`auction:${auctionId}`);

    console.log(
      `${socket.id} left auction:${auctionId}`,
    );
  });
}