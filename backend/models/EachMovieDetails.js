import { Schema, model } from "mongoose"

const GenreSchema = new Schema({
    id: { type: String, required: true },
    name: { type: String, required: true }
}, { _id: false }); 

const SimilarMovieSchema = new Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    poster_path: { type: String, required: true },
    backdrop_path: { type: String, required: true }
}, { _id: false });

const SpokenLanguageSchema = new Schema({
    id: { type: String, required: true },
    english_name: { type: String, required: true }
}, { _id: false });

const EachMovieSchema = new Schema({
    // Direct Fields
    id: {
        type: String, 
        required: true,
        unique: true 
    },
    title: {
        type: String,
        required: true
    },
    overview: {
        type: String,
        required: true
    },
    backdrop_path: {
        type: String,
        required: true
    },
    poster_path: {
        type: String,
        required: true
    },

    adult: {
        type: Boolean,
        required: true
    },

    
    budget: {
        type: String, 
        required: true
    },
    runtime: {
        type: Number,
        required: true
    },
    vote_average: {
        type: Number, 
        required: true
    },
    vote_count: {
        type: Number,
        required: true
    },

    release_date: {
        type: String,
        required: true
    },
    genres: {
        type: [GenreSchema],
        required: true
    },
    similar_movies: {
        type: [SimilarMovieSchema], 
        required: true
    },
    spoken_languages: {
        type: [SpokenLanguageSchema], 
        required: true
    }
}, { timestamps: true }); 

export const EachMovieData = model("eachmoviedata", EachMovieSchema);