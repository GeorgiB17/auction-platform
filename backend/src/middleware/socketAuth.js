import jwt from "jsonwebtoken";

export function socketAuth(socket, next) {
  const cookies = socket.handshake.headers.cookie;

  if (!cookies) {
    return next(new Error("No cookies"));
  }

  const token = cookies
    .split("; ")
    .find((cookie) => cookie.startsWith("token="))
    ?.split("=")[1];

  if (!token) {
    return next(new Error("No token"));
  }

  try {
    const decoded = jwt.verify(token, "secret_key");

    socket.userId = decoded.id;

    next();
  } catch {
    next(new Error("Invalid token"));
  }
}