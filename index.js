const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const app = express();
const bcrypt = require("bcrypt");
const { check, validationResult } = require('express-validator');

//integration with a REST API, requiring Mongoose/Models and access to movies/users/genres/directos
const Models = require("./models.js");
const mongoose = require("mongoose");

//const myFlixDB = Models.Movie;
const Movies = Models.Movie;
const Users = Models.User;

//Local MongoDB local <-------------> online database
//mongoose.connect("mongodb://127.0.0.1:27017/myFlixDB", { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

//Middleware 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("common"));

// added localhost, Heroku, Netifly
let allowedOrigins = ['http://localhost:8081', 'http://localhost:1234', 'https://herokumyflixdb.herokuapp.com/', 'https://cicciotazza-myflix.netlify.app/',
  'http://localhost:4200/', 'https://cicciotazza.github.io/myFlix-Angular-client/', 'https://cicciotazza.github.io/myFlix-Angular-app/', '*'];

//import cors
const cors = require('cors');

// Either cut off this line bottom or the next code /* app.use...}))); */
app.use(cors());

/*app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      // If a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  }
}));*/



//Import "Auth.js" file and Passport module
let auth = require('./auth')(app);
const passport = require("passport");
require("./passport.js");

//Home
app.get("/",
  (req, res) => {
    res.send("Hello, welcome to myFlix App.");
  });

//Documentation
app.get("/documentation", (req, res) => {
  res.sendfile("/public/documentation.html", { root: __dirname })
}),

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

//GET a movie by title
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

//GET user by username
app.get("/users/:Username",
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

//GET movie by genre
app.get("/genres/:genreName",
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

//GET movie by director
app.get("/directors/:Name",
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

//ADD a new user (JSON format)
app.post("/users", [
  // Validation logic here for request
  //you can either use a chain of methods like .not().isEmpty()
  //which means "opposite of isEmpty" in plain english "is not empty"
  //or use .isLength({min: 5}) which means
  //minimum value of 5 characters are only allowed
  check('userName', 'Username is required').isLength({ min: 5 }),
  check('userName', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('password', 'Password is required').not().isEmpty(),
  check('email', 'Email does not appear to be valid').isEmail()
], (req, res) => {
  // check the validation object for errors
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  let hashedPassword = Users.hashPassword(req.body.password);
  Users.findOne({ userName: req.body.userName })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.userName + "already exists");
      } else {
        Users.create({
          userName: req.body.userName,
          password: hashedPassword,
          email: req.body.email,
          Birthday: req.body.Birthday
        })
          .then((user) => { res.status(201).json(user); })
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

//UPDATE existing user by username
//let hashedPassword = Users.hashPassword(req.body.password);
app.put("/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { userName: req.params.Username },
      {
        $set: {
          userName: req.body.userName,
          //password: hashedPassword,
          password: req.body.password,
          email: req.body.email,
          Birthday: req.body.birthday
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

//ADD movie to a user's list of favorites
app.post("/users/:userName/favoriteMovies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { userName: req.params.userName }, {
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
app.delete("/users/:userName",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndRemove({ userName: req.params.userName })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.userName + " was not found");
        } else {
          res.status(200).send(req.params.userName + " was deleted");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error" + err);
      });
  });

//DELETE movie from favorite 
app.delete("/users/:userName/movies/:title",
  (req, res) => {
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

//Listens for requests, port 8080
const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("This app is listening on port 8080.");
});