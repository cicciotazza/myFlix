const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const uuid = require("uuid");
const app = express();

//integration with a REST API, requiring Mongoose/Models and access to movies/users/genres/directos
const mongoose = require("mongoose");
const Models = require("./models.js");

//server side validation
const { check, validationResult } = require("express-validator");

const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;

//Local MongoDB local <-------------> online database
//mongoose.connect("mongodb://127.0.0.1:27017/myFlixDB",{ useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

//Express framework and its middleware 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Middleware function
app.use(express.static("public"));
app.use(express.json());
app.use(morgan("common"));

//Import CORS (Cross-Origin-Resource-Sharing)
//by default the application allows requests from all origins
const cors = require("cors");
app.use(cors());

//if you want only certain origins to be given access: list of allowed domains within the variable allowedOrigins
/*
app.use(cors());
let allowedOrigins ["http://localhost:8080", "htpp://testsite.com"];
app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      //If a specific origin isn’t found on the list of allowed origins
      let message ="The CORS policy for this application doesn't allow access from origin " + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));
*/

//Import "Auth.js" file
let auth = require("./auth")(app);
const passport = require("passport");
require("./passport");

//GET req, welcome message as res
app.get("/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.send("Hello, welcome to myFlix App.");
  });

//GET all movies
app.get("/movies",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.find()
      .then((movies) => {
        res.status(200).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  });

//Get all users
app.get("/users",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.find()
      .then((users) => {
        res.status(200).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error" + error);
      });
  });

//GET data about one specific movie 
app.get("/movies/:title",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ Title: req.params.title })
      .then((movie) => {
        res.json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error" + err)
      });
  });

//GET data about one user by Username 
app.get("/users/:userName",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOne({ userName: req.params.Username })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error" + error);
      });
  });

//GET data about a movie-genre by name/title.
app.get("/genre/:genreName",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ "Genre.Name": req.params.genreName })
      .then((movie) => {
        res.json(movie.Genre)
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error" + err);
      });
  });

//GET data about movie-director by name
app.get("/director/:Name",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ "Director.Name": req.params.Name })
      .then((movie) => {
        res.json(movie.Director);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error" + err);
      });
  });

//ADD a new user with JSON format
app.post("/users",
  //validation logic for the request
  [
    check("Username", "Username is required").isLength({ min: 4 }),
    check("Username", "Username contains non alphanumeric characters - not allowed.").isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail()
  ],
  (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    //hash any password when registering before storing it on the MongoDB db
    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username })
      //Search if a user with a requested username already exists
      .then((user) => {
        if (user) {
          //if user found, sens a response that it already exists
          return res.status(400).send(req.body.Username + "already exists");
        } else {
          Users.create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
            .then((user) => { res.status(201).json(user); })
            .catch((error) => {
              console.error(error);
              res.status(500).send("Error: " + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  });
/*   {
ID: Integer,
Username: String,
Password: String,
Email: String,
Birthday: Date
      }       */

//UPDATE a user info, by username
app.put("/users/:Username",
  //validation logic for the request
  [
    check("Username", "Username is required").isLength({ min: 4 }),
    check("Username", "Username contains non alphanumeric characters - not allowed.").isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail()
  ],
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        }
      },
      { new: true },
      (err, updatedUser) => {
        if (err) {
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
  (req, res) => {
    //movies/:MovieID
    Users.findOneAndUpdate(
      { Username: req.params.Username }, {
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
app.delete("/users/:username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //Username
    Users.findOneAndRemove({ Username: req.params.username })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.username + " was not found");
        } else {
          res.status(200).send(req.params.username + " was deleted");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error" + err);
      });
  });

//DELETE movie from list of favorite 
app.delete("/users/:userName/FavoriteMovies/:movieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //"/users/:username/Movies/:Name",
    Users.findOneAndUpdate({ userName: req.params.userName }, {
      $pull: { FavoriteMovies: req.params.title }
    },
      { new: true },
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error" + err);
        } else {
          res.json(updatedUser);
        }
      });
  });


app.get("/secreturl", (req, res) => {
  res.send("This content is top SECRET")
});

//Error handler with log all function
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Error founded, fix it!");
  next();
});

//App listenerer on port...
const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on port " + port);
});