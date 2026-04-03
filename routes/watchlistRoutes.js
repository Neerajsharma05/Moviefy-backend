import express from "express";
import verifyToken from "../middleware/verifyToken.js";

import {
  addToWatchlist,
  getWatchlist,
  removeFromWatchlist,
  toggleWatchlist
} from "../controllers/watchlistController.js";

const router = express.Router();

router.post("/add", verifyToken, addToWatchlist);

router.post("/toggle", verifyToken, toggleWatchlist);

router.get("/", verifyToken, getWatchlist);

router.delete("/:movieId", verifyToken, removeFromWatchlist);

export default router;