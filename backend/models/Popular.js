import {Schema,model} from "mongoose"

const PopularSchema = {
    id : {
        type:String,
        required:true,
        unique:true
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

const PopularMoviesSchema = new Schema(PopularSchema)
export const PopularMoviesData = model("popularmovies",PopularMoviesSchema)