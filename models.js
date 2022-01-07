const mongoose = require("mongoose");

let movieSchema = mongoose.Schema({
    Title: {type: String, required: true},
    Descrtiption: {type: String, required: true},
    Genre: {
        Name: String,
        Description: String,
    },
    Director: {
        Name: String,
        Bio: String,
    },
    Actors: [String],
    ImagePath: String,
    Featured: Boolean,
});

let userSchema = mongoose.Schema ({
    Username: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    Birthday: Date,
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie"}]
});

//create models that use the scemas defined 
let Movie = mongoose.model("Movie", movieSchema);
let User = mongoose.model("User", userSchema);
//any titles passed through will come out on the other side as lowercase and pluralized

module.exports.Movie = Movie;
module.exports.USer = User;