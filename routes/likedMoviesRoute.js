import express from "express";
import verifyToken from "../middleware/verifyToken.js";

import {
    addTolikedMovies,
    getLikedMovies
}from '../controllers/likedMoviesController.js'



const router = express.Router();

router.post('/add', verifyToken, addTolikedMovies);

router.get('/list', verifyToken, getLikedMovies);

export default router;