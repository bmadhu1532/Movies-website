import express from "express";
import z from "zod";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import cors from "cors";
import axios from "axios";
import compression from "compression";
import { v4 as uuidv4 } from "uuid";
import { UserModel } from "./models/Usermodel.js";
import { TopRatedMovies } from "./models/TopRatedMovies.js";
import { TrendingMoviesData } from "./models/TrendingMovies.js";
import { OriginalsData } from "./models/Originals.js";
import { PopularMoviesData } from "./models/Popular.js";
import { EachMovieData } from "./models/EachMovieDetails.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(compression());

const allowedOrigins = [
  "http://localhost:5173",             // local dev
  "http://localhost:5174",
  "https://umoviesproject.vercel.app"  // deployed frontend
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
}));

app.options("*", cors());


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

    const webhookURL = process.env.N8N_WEBHOOK_URL;
    if (webhookURL) {
      try {
        await axios.post(
          webhookURL,
          { username, email },
          { headers: { "Content-Type": "application/json" }, timeout: 5000 }
        );
      } catch (err) {
        console.error("n8n webhook error:", err.message);
      }
    }

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
async function connection() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected");
    const PORT = process.env.PORT || 7899;
    app.listen(PORT, () => {
      console.log(`Server is running at port no : ${PORT}`);
    });
  } catch (err) {
    console.log("MongoDB connection Error:", err);
    process.exit(1);
  }
}
connection();
