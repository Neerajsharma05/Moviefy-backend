import { getDB } from "../config/db.js";
// for liked movies
export const addTolikedMovies = async (req, res) => {
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

    // ✅ VALIDATION
    if (!userId || !movie_id || !title?.trim()) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    // 🔍 CHECK in liked table (FIXED)
    const [existing] = await db.execute(
      "SELECT * FROM liked WHERE userId=? AND movie_id=?",
      [userId, movie_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        message: "Movie already liked",
      });
    }

    // ✅ INSERT
    const sql = `
      INSERT INTO liked
      (userId, movie_id, title, poster_path, vote_average, isLiked, is_deleted, release_date)
      VALUES (?,?,?,?,?,?,?,?)
    `;

    await db.execute(sql, [
      userId,
      movie_id,
      title,
      poster_path || null,
      vote_average || null,
      1,
      0,
      release_date || null,
    ]);

    console.log({
      userId,
      movie_id,
      title,
      poster_path,
      vote_average,
    });

    return res.status(200).json({
      message: "Movie liked",
      status: "liked",
    });

  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        message: "Movie already liked",
      });
    }

    console.error("Add Liked Error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};


export const getLikedMovies = async (req, res) => {
      const db = getDB();
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const [movies] = await db.execute(
      "SELECT * FROM liked WHERE userId=? ORDER BY liked_at DESC",
      [userId]
    );

    res.json(movies);

  } catch (error) {
    console.error("Get Liked Movies Error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};