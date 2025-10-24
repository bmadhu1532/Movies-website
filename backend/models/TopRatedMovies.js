import { Schema,model } from "mongoose";

const TopRatedSchema = {
    id : {
        type:String,
        required:true
    },
    overview: {
        type:String,
        required:true
    },
    title: {
        type:String,
        required:true
    },
    backdrop_path: {
        type:String,
        required:true
    },
    poster_path: {
        type:String,
        required:true
    }
}

const moviesSchema = new Schema(TopRatedSchema)
export const TopRatedMovies = model("topratedmovies",moviesSchema)