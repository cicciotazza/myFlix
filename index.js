const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const app = express();

//integration with a REST API, requiring Mongoose/Models and access to movies/users/genres/directos
const mongoose = require("mongoose");
const Models = require("./models.js");

//const myFlixDB = Models.Movie;
const Movies = Models.Movie;
const Users = Models.User;


//link to MongoDB database
mongoose.connect("mongodb://127.0.0.1:27017/myFlixDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

//Express framework and its middleware 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Middleware function
app.use(express.static("public"));
app.use(express.json());
app.use(morgan("common"));

//Import "Auth.js" file and Passport module
const passport = require("passport");
require("./passport");

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
app.post("/users", (req, res) => {
  Users.findOne({ userName: req.body.userName })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.userName + "already exists");
      } else {
        Users.create({
          userName: req.body.userName,
          password: req.body.password,
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
app.put("/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { userName: req.params.Username },
      {
        $set: {
          userName: req.body.userName,
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
app.listen(8080, () => {
  console.log("This app is listening on port 8080.");
});