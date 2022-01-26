const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

let movieSchema = mongoose.Schema({
    Title: { type: String, required: true },
    Descrtiption: { type: String, required: true },
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

let userSchema = mongoose.Schema({
    userName: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    Birthday: Date,
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }]
});

//new addition for "bcrypt"
userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 5);
};

userSchema.methods.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};                                      //changed line 33/34 to "this.password" lower case


//create models that use the scemas defined (plurals and must be LOWER-CASE)
let Movie = mongoose.model("Movie", movieSchema);
let User = mongoose.model("User", userSchema);
//any titles passed through will come out on the other side as lowercase and pluralized

module.exports.Movie = Movie;
module.exports.User = User;