const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const uuid = require("uuid");
const app = express();
//const { check, validationResult } = require("express-validator");
//integration with a REST API, requiring Mongoose/Models and access to movies/users/genres/directos
const mongoose = require("mongoose");
const Models = require("./models.js");

const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre; 
const Directors = Models.Director;

//link to MongoDB database
mongoose.connect("mongodb://127.0.0.1:27017/myFlixDB",
    {   useNewUrlParser: true, 
        useUnifiedTopology: true 
    });

//Express framework and its middleware 
app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({ extended: true }));

//Middleware function
app.use(express.static("public"));
app.use(express.json());
app.use(morgan("common"));

//Import "Auth.js" file
let auth = require("./auth")(app);
const passport = require("passport");
require("./passport");


//GET req, welcome message as res
app.get("/",
passport.authenticate("jwt", { session: false }), 
 (req, res) =>{
    res.send("Hello, welcome to myFlix App.");
  });

//GET all movies
app.get("/movies",
passport.authenticate("jwt", { session: false }), 
  (req, res) =>{
  Movies.find()
    .then((movies) =>{
      res.status(200).json(movies);
    })
    .catch((err) =>{
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//Get all users
app.get("/users",
passport.authenticate("jwt", { session: false }), 
 (req, res) =>{
    Users.find()
        .then((users) =>{
            res.status(200).json(users);
        })
        .catch((err) =>{
            console.error(err);
            res.status(500).send("Error" + error);
        });
});

//GET data about one specific movie 
app.get("/movies/:title",
passport.authenticate("jwt", { session: false }), 
 (req, res) =>{
    Movies.findOne({Title: req.params.title})
    .then((movie)=>{
        res.json(movie);
    })
    .catch((err)=>{
        console.error(err);
        res.status(500).send("Error" + err)
    });
});

//GET data about one user by Username 
app.get("/users/:userName",
passport.authenticate("jwt", { session: false }), 
 (req, res) =>{
    Users.findOne({ userName: req.params.Username})
    .then((user) =>{
        res.json(user);
    })
    .catch((err)=>{
        console.error(err);
        res.status(500).send("Error" + error);
    });
});

//GET data about a movie-genre by name/title.
 app.get("/genres/:genreName",
 passport.authenticate("jwt", { session: false }), 
  (req, res) =>{
    Movies.findOne({"Genre.Name": req.params.genreName})
    .then((movie)=>{
        res.json(movie.Genre)
    })
    .catch((err)=>{
        console.error(err);
        res.status(500).send("Error" + err);
    });
});   

//GET data about movie-director by name
app.get("/director/:Name",
passport.authenticate("jwt", { session: false }), 
 (req, res) =>{
  Directors.findOne({"Director.Name": req.params.Name})
  .then((director)=>{
      res.json(Director);
  })
  .catch((err)=>{
      console.error(err);
      res.status(500).send("Error" + err);
  });
});

//NOT WORKING ALTERNATIVES
/*app.get("/genre/:Name", (req, res) =>{
  Genres.findOne({ Name: req.params.Name })
    .then((genre) =>{
      res.json(genre.Description);
    })
    .catch((err) =>{
      console.error(error);
      res.status(500).send("Error: " + err);
    });
});

app.get("/directors/:Name", (req, res) =>{
    myFlixDB.findOne({"Director.Name": req.params.Name})
    .then((movie)=>{
        res.json(movie.Director);
    })
    .catch((err)=>{
        console.error(err);
        res.status(500).send("Error" + err);
    });
});*/

    //ADD a new user with JSON format
    app.post("/users", (req, res) =>{
      Users.findOne({ Username: req.body.Username })
        .then((user) =>{
          if (user) {
            return res.status(400).send(req.body.Username + "already exists");
          } else {
            Users.create({
                Username: req.body.Username,
                Password: req.body.Password,
                Email: req.body.Email,
                Birthday: req.body.Birthday
              })
              .then((user) =>{res.status(201).json(user); })
              .catch((error) =>{
                console.error(error);
                res.status(500).send("Error: " + error);
              })
          }
        })
        .catch((error) =>{
          console.error(error);
          res.status(500).send("Error: " + error);
        });
    });
  /*    {
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
        }       */

//UPDATE a user info, by username
app.put("/users/:Username",
passport.authenticate("jwt", { session: false }), 
 (req, res) =>{
  Users.findOneAndUpdate(
    { Username: req.params.Username }, 
    { $set:{
      Username: req.body.username,
      Password: req.body.password,
      Email: req.body.email,
      Birthday: req.body.birthday
    }
  },
  { new: true },
  (err, updatedUser) =>{
    if(err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    } else {
      res.json(updatedUser);
    }
  });
});

//ADD one movie to a user's list of favorites
app.post("/users/:Username/favoriteMovies/:MovieID",
passport.authenticate("jwt", { session: false }), 
 (req, res) =>{
                          //movies/:MovieID
    Users.findOneAndUpdate(
      { Username: req.params.Username }, {
       $push: { FavoriteMovies: req.params.MovieID }},
     { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) =>{
      if (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(updatedUser);
      }
    });
  });

//DELETE one user by name
app.delete("/users/:username",
passport.authenticate("jwt", { session: false }), 
 (req, res) =>{
  //Username
  Users.findOneAndRemove({ Username: req.params.username})
  .then((user) =>{
      if (!user) {
        res.status(400).send(req.params.username + " was not found");
  } else {
        res.status(200).send(req.params.username + " was deleted");
         }
  })
    .catch((err)=>{
      console.error(err);
      res.status(500).send("Error" + err);
  });
});

//DELETE movie from list of favorite 
app.delete("/users/:userName/FavoriteMovies/:movieID",
passport.authenticate("jwt", { session: false }), 
 (req, res) =>{
        //"/users/:username/Movies/:Name",
    Users.findOneAndUpdate({userName: req.params.userName}, {
        $pull: {FavoriteMovies: req.params.title}},
    { new: true},
   (err, updatedUser) =>{
       if (err) {
           console.error(err);
           res.status(500).send("Error" + err);
       } else {
           res.json(updatedUser);
       }
   });
});


app.get("/secreturl", (req, res) =>{
    res.send("This content is top SECRET")
});

//Error handler with log all function
app.use((err, req, res, next) =>{
console.error(err.stack);
res.status(500).send("Error founded, fix it!");
next();  
});

//Listens for requests, port 8080
app.listen(8080, () =>{
    console.log("This app is listening on port 8080.");
});