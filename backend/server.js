import express from "express";
import z from "zod";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import cors from "cors";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { UserModel } from "./models/Usermodel.js";
import { TopRatedMovies } from "./models/TopRatedMovies.js";
import { TrendingMoviesData } from "./models/TrendingMovies.js";
import { OriginalsData } from "./models/Originals.js";
import { PopularMoviesData } from "./models/Popular.js";
import { EachMovieData } from "./models/EachMovieDetails.js";

dotenv.config();

// --- Global CORS (allow all) ---
// app.use(cors());

const app = express();

// Allow frontend requests
app.use(cors({
  origin: ["http://localhost:5173", "https://umoviesproject.onrender.com"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());


const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
  
};



// ---------------- SIGN UP ----------------
app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const UserRules = z.object({
      username: z.string().min(4).max(20),
      email: z.string().email(),
      password: z.string().min(6).max(15),
    });

    const parsedData = UserRules.safeParse({ username, email, password });
    if (!parsedData.success) {
      return res.status(400).json({ message: "Please give valid Inputs" });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({
      userId: uuidv4(), 
      username,
      email,
      password: hashedPassword,
    });

    

    res.status(201).json({
      message: "User created successfully",
      user: {
        userId: newUser.userId,  
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error("/register error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});


// ---------------- LOGIN ----------------
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const isUserPresent = await UserModel.findOne({ email });
  if (!isUserPresent) {
    return res.status(400).json({ message: "Invalid email or user not found" });
  }

  const verification = await bcrypt.compare(password, isUserPresent.password);
  if (!verification) {
    return res.status(400).json({ message: "Invalid password" });
  }


  const token = jwt.sign(
    { userId: isUserPresent.userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.status(200).json({
    message: "Sign in successful",
    jwt_token: token,
    user: {
      userId: isUserPresent.userId,
      username: isUserPresent.username,
      email: isUserPresent.email,
    },
  });
});


// ---------------- AUTOMATION PROXY ----------------
app.post("/automation/register", async (req, res) => {
  try {
    const { username, email, userId } = req.body || {};
    const webhookURL = process.env.N8N_WEBHOOK_URL;

    if (!webhookURL) {
      return res.status(200).json({ forwarded: false, message: "N8N_WEBHOOK_URL not configured" });
    }

    const payload = { username, email, userId };
    // Use axios to avoid relying on global fetch availability
    const resp = await axios.post(webhookURL, payload, {
      headers: { "Content-Type": "application/json" },
      validateStatus: () => true, // always resolve; we map status below
    });

    // Do not block frontend on webhook status; just return lightweight info
    if (resp.status < 200 || resp.status >= 300) {
      return res.status(200).json({ forwarded: false, status: resp.status });
    }
    return res.status(200).json({ forwarded: true, status: resp.status });
  } catch (err) {
    console.error("Automation proxy error:", err);
    return res.status(200).json({ forwarded: false, error: err.message });
  }
});


// ---------------- MOVIES ROUTES ----------------
app.get("/movies-app/top-rated-movies",verifyToken, async (req, res) => {
  try {
    const topRated = await TopRatedMovies.find().lean();
    res.set("Cache-Control", "public, max-age=300, s-maxage=600");
    res.status(200).json({ results: topRated, total: topRated.length });
  } catch (err) {
    console.log(`Error: ${err}`);
  }
});

app.get("/movies-app/trending-movies",verifyToken, async (req, res) => {
  try {
    const trendingData = await TrendingMoviesData.find().lean();
    res.set("Cache-Control", "public, max-age=300, s-maxage=600");
    res.status(200).json({ data: trendingData, status: "SUCCESS" });
  } catch (err) {
    console.log(`Error: ${err}`);
  }
});

app.get("/movies-app/originals",verifyToken, async (req, res) => {
  try {
    const OriginalsMoviesData = await OriginalsData.find().lean();
    res.set("Cache-Control", "public, max-age=300, s-maxage=600");
    res.status(200).json({
      results: OriginalsMoviesData,
      total: OriginalsMoviesData.length,
    });
  } catch (err) {
    console.log(`error: ${err}`);
  }
});

app.get("/movies-app/popular-movies",verifyToken, async (req, res) => {
  try {
    const Popularmovies = await PopularMoviesData.find().lean();
    res.set("Cache-Control", "public, max-age=300, s-maxage=600");
    res.status(200).json({
      results: Popularmovies,
      length: Popularmovies.length,
    });
  } catch (err) {
    console.log(`Error: ${err}`);
  }
});

app.get("/movies-app/movies/:movieId",verifyToken, async (req, res) => {
  const movieId = req.params.movieId;
  try {
    const movieDetails = await EachMovieData.findOne({ id: movieId }).lean();
    if (!movieDetails) {
      return res.status(404).json({ message: "No Movie Found" });
    }
    res.set("Cache-Control", "public, max-age=300, s-maxage=600");
    res.status(200).json({ movie_details: movieDetails });
  } catch (err) {
    console.error(`Error: ${err}`);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

app.get("/movies-app/movies-search",verifyToken, async (req, res) => {
  try {
    const { search } = req.query;
    if (!search) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const searchResults = await EachMovieData.find({
      title: { $regex: search, $options: "i" },
    }).lean();

    res.set("Cache-Control", "public, max-age=60, s-maxage=120");
    res.status(200).json({
      results: searchResults,
      total: searchResults.length,
    });
  } catch (error) {
    console.error("Search API Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.get("/profile",verifyToken,async(req,res)=> {
  try {
     const user = await UserModel.findOne({ userId: req.user.userId }).select("-password").lean()
    res.set("Cache-Control", "public, max-age=60, s-maxage=120");
    res.status(200).json({
      userDetails: user
    })
  }
  catch(err) {
    console.log(`Error:${err}`)
  }
})


// Global JSON error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || "Server Error",
    error: process.env.NODE_ENV === "production" ? undefined : String(err.stack || err),
  });
});


// ---------------- MONGODB CONNECTION ----------------
async function connection(withRetry = true) {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running at port no : ${PORT}`);
    });
  } catch (err) {
    console.log("MongoDB connection Error:", err?.message || err);
    if (withRetry) {
      const delayMs = 3000;
      console.log(`Retrying MongoDB connection in ${delayMs / 1000}s...`);
      setTimeout(() => connection(withRetry), delayMs);
    } else {
      process.exit(1);
    }
  }
}
connection(true);
