const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const uuid = require("uuid");
const app = express();

//integration with a REST API, requiring Mongoose/Models and access to movies/users/genres/directos
const mongoose = require("mongoose");
const Models = require("./models.js");

const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;

//Express framework and its middleware 
app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({ extended: true }));

//Middleware function
app.use(express.static("public"));
app.use(express.json());
app.use(morgan("common"));

//link to MondoDB database
mongoose.connect("mongodb://localhost:27017/myFlixDB",
    {   useNewUrlParser: true, 
        useUnifiedTopology: true 
    });

//GET req, welcome message as res
app.get("/", (req, res) =>{
    res.send("Hello, welcome to myFlix App.");
  });

//GET all movies
app.get("/movies", (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//Get all users
app.get("/users", (req, res) => {
    Users.find()
        .then((users) => {
            res.status(201).json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error" + error);
        });
});

//GET data about one specific movie 
app.get("/movies/:title", (req, res) => {
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
app.get("/users/:Username", (req, res) => {
    Users.findOne({ userName: req.params.Username})
    .then((user) => {
        res.json(user);
    })
    .catch((err)=>{
        console.error(err);
        res.status(500).send("Error" + error);
    });
});

//GET data about a movie-genre by name/title.
app.get("/genres/:name", (req, res) => {
    Movies.findOne({"Genre.Name": req.params.genre})
    .then((movie)=>{
        res.json(movie.Genre)
    })
    .catch((err)=>{
        console.error(err);
        res.status(500).send("Error" + err);
    });
});

//GET data about movie-director by name
app.get("/directors/:directorName", (req, res) => {
    myFlixDB.findOne({"Director.Name": req.params.directorName})
    .then((movie)=>{
        res.json(movie.Director);
    })
    .catch((err)=>{
        console.error(err);
        res.status(500).send("Error" + err);
    });
});

//ADD a new user with JSON format
app.post("/users", (req, res) => {
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return 
res.status(400).send(req.body.Username + "already exists");
        } else {
          Users.create({
              Username: req.body.Username,
              Password: req.body.Password,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then((user) =>{res.status(201).json(user) })
          .catch((error) => {
            console.error(error);
            res.status(500).send("Error: " + error);
          })
        }
      })
      .catch((error) => {
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
app.put("/users/:Username", (req, res) => {
  Users.findOneAndUpdate({ Username: 
    req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true },
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    } else {
      res.json(updatedUser);
    }
  });
});

//ADD one movie to a user's list of favorites
app.post("/users/:Username/movies/:MovieID", (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
       $push: { FavoriteMovies: req.params.MovieID }
     },
     { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(updatedUser);
      }
    });
  });

//DELETE one user by name
app.delete("/users/:deleteUser", (req, res) => {
    Users.findOneAndRemove({ userName: req.params.deleteUser})
    .then((user) =>{
        if (!user) {
            res.status(400).send(req.params.userName + " was not found");
        } else {
            res.status(200).send(req.params.userName + " was deleted");
        }
    })
    .catch((err)=>{
        console.error(err);
        res.status(500).send("Error" + err);
    });
});

//DELETE movie from list of favorite 
app.delete("/users/:userName/movies/:title", (req, res) => {
        //"/users/:username/FavoriteMovies/:movieID",
    Users.findOneAndUpdate({userName: req.params.userName}, {
        $pull: {FavoriteMovies: req.params.title}
    },
    { new: true},
   (err, updatedUser) => {
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
app.use((err, req, res, next) => {
console.error(err.stack);
res.status(500).send("Error founded, fix it!");
next();  
});

//Listens for requests, port 8080
app.listen(8080, () =>{
    console.log("This app is listening on port 8080.");
});