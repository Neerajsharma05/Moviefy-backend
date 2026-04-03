import { getDB } from "../config/db.js";

// Add movie to watchlist
export const addToWatchlist = async (req, res) => {
      const db = getDB();
  try {
    const userId = req.user?.id;

    const { movie_id, title, poster_path, vote_average } = req.body;

    // 🔥 VALIDATION (IMPORTANT)
    if (!userId || !movie_id || !title) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const sql = `
  INSERT INTO watchlist
  (user_id, movie_id, title, poster_path, vote_average, isWatchList, is_deleted, release_date)
  VALUES (?,?,?,?,?,?,?,?)
`;
    await db.execute(sql, [
      userId ?? null,
      movie_id ?? null,
      title ?? null,
      poster_path ?? null,
      vote_average ?? null,
      1, // isWatchList
      0, // is_deleted
      req.body.release_date ?? null,
    ]);

    console.log({
      userId,
      movie_id,
      title,
      poster_path,
      vote_average,
    });

    res.json({
      message: "Movie added to watchlist",
    });
    if (!userId || !movie_id || !title?.trim()) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        message: "Movie already in watchlist",
      });
    }

    console.error("Add Watchlist Error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const toggleWatchlist = async (req, res) => {
      const db = getDB();
  try {
    const userId = req.user?.id;

    const {
      movie_id,
      title,
      poster_path,
      vote_average,
      release_date
    } = req.body;

    if (!userId || !movie_id || !title?.trim()) {
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    // 🔍 Check if already exists
    const [existing] = await db.execute(
      "SELECT * FROM watchlist WHERE user_id=? AND movie_id=?",
      [userId, movie_id]
    );

    // ❌ If exists → REMOVE
    if (existing.length > 0) {
      await db.execute(
        "DELETE FROM watchlist WHERE user_id=? AND movie_id=?",
        [userId, movie_id]
      );

      return res.json({
        message: "Removed from watchlist",
        status: "removed"
      });
    }

    // ✅ If not → ADD
    await db.execute(
      `INSERT INTO watchlist 
      (user_id, movie_id, title, poster_path, vote_average, release_date, isWatchList, is_deleted)
      VALUES (?,?,?,?,?,?,?,?)`,
      [
        userId,
        movie_id,
        title,
        poster_path ?? null,
        vote_average ?? null,
        release_date ?? null,
        1,
        0
      ]
    );

    res.json({
      message: "Added to watchlist",
      status: "added"
    });

  } catch (error) {
    console.error("Toggle Watchlist Error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

// Get watchlist
export const getWatchlist = async (req, res) => {
      const db = getDB();
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const [movies] = await db.execute(
      "SELECT * FROM watchlist WHERE user_id=? ORDER BY added_at DESC",
      [userId],
    );

    res.json(movies);
  } catch (error) {
    console.error("Get Watchlist Error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Remove from watchlist
export const removeFromWatchlist = async (req, res) => {
      const db = getDB();
  try {
    const userId = req.user?.id;
    const { movieId } = req.params;

    if (!userId || !movieId) {
      return res.status(400).json({
        message: "Invalid request",
      });
    }

    await db.execute("DELETE FROM watchlist WHERE user_id=? AND movie_id=?", [
      userId,
      movieId,
    ]);

    res.json({
      message: "Removed from watchlist",
    });
  } catch (error) {
    console.error("Remove Watchlist Error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
