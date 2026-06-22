import express from "express";
import { auth } from "../services/authService.js";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const jwtSecret = process.env.JWT_SECRET || "secret_key";

export const router = express.Router();

router.get("/user", authMiddleware, async (req, res) => {
  let user = await prisma.user.findUnique({
    where: { username: req.user.username }
  });

  if (!user) {
    return res.status(401).json({ success: false, message: "Kein Benutzer gefunden" });
  }

  return res.json({
    success: true,
    user: {
      username: user.username,
      role: user.role,
    },
  });
});

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  
  let role; 
  try {
    const ldapUser = await auth(username, password);
    
    if (ldapUser) {
      const path = ldapUser.homeDirectory;
      if(path.split("/")[2] === "ma") {
          role = "MITARBEITER"
      }
      else {
          role = "STUDENT"
      }

      let dbUser = await prisma.user.findUnique({
        where: { username }
      });

      if (!dbUser) {
        dbUser = await prisma.user.create({
          data: {
            username,
            role,
          },
        });
      }

      let user = { ...ldapUser, role };

      console.log("Login erfolgreich:", user);
      
      const token = jwt.sign({ id: dbUser.id, username: ldapUser.uid, role: role }, jwtSecret, { expiresIn: "1h" }); //add secret key to env
      
      res.cookie("token", token, {
        httpOnly: true, 
        secure: false, 
        sameSite: "lax",
        maxAge: 1000 * 60 * 60
      });

      return res.json({
        success: true, 
      });
    } else {
      console.log("Login fehlgeschlagen für Benutzer:", ldapUser);
      return res.status(401).json({success: false, message: "Ungültige Anmeldedaten"});
    }

  } catch (err) {
    console.error(err);
    return res.status(500).json({success: false, message: "Serverfehler"});
  }
});

router.post("/logout", authMiddleware, (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
  return res.json({ success: true, message: "Erfolgreich ausgeloggt" });
});