import express from "express";
import QRCode from "qrcode";

const router = express.Router();

router.get("/generate", async (req, res, next) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ error: "token required" });
    const png = await QRCode.toBuffer(token, { type: "png", scale: 8 });
    res.set("Content-Type", "image/png");
    res.send(png);
  } catch (err) {
    next(err);
  }
});

export default router;
