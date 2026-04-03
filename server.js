import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import watchlistRoutes from "./routes/watchlistRoutes.js";
import likedMoviesRoute from "./routes/likedMoviesRoute.js";

dotenv.config();

const app = express();

// ✅ CORS FIX (dynamic)
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use(express.json());

// ✅ DB connect
await connectDB();

// ✅ ENV variables use karo
const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

// routes
app.use("/api/auth", authRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/liked", likedMoviesRoute);

// 🎬 Popular movies
app.get("/api/movies/popular", async (req, res) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
    );
    res.json(response.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error fetching data" });
  }
});

// 🔍 Search movies
app.get("/api/movies/search", async (req, res) => {
  const query = req.query.q;
  try {
    const response = await axios.get(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`
    );
    res.json(response.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error searching movies" });
  }
});
// emotional
app.get("/api/movies/emotion", async (req, res) => {
  const { mood, industry, page = 1 } = req.query;

  const moodGenreMap = {
    Happy: [35],
    Sad: [18],
    Romantic: [10749],
    Scary: [27],
    Excited: [28],
  };

  const genres = moodGenreMap[mood] || [28];
  const language = industry === "Bollywood" ? "hi" : "en";
  const region = industry === "Bollywood" ? "IN" : "US";

  try {
    const response = await axios.get(
      `${BASE_URL}/discover/movie?api_key=${process.env.TMDB_API_KEY}&with_genres=${genres.join(",")}&with_original_language=${language}&region=${region}&sort_by=popularity.desc&page=${page}`
    );

    res.json(response.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error fetching movies" });
  }
});

// fro popular movies
app.get("/api/movies/popular", async (req, res) => {
  const { industry, page = 1 } = req.query;

  const language = industry === "Bollywood" ? "hi" : "en";
  const region = industry === "Bollywood" ? "IN" : "US";

  try {
    const response = await axios.get(
      `${BASE_URL}/movie/popular?api_key=${process.env.TMDB_API_KEY}&language=${language}&region=${region}&page=${page}`
    );

    res.json(response.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error fetching popular movies" });
  }
});

// top Rated movies 
app.get("/api/movies/top-rated", async (req, res) => {
  const { page = 1 } = req.query;

  try {
    const response = await axios.get(
      `${BASE_URL}/movie/top_rated?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=${page}`
    );

    res.json(response.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error fetching top rated movies" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT}`)
);