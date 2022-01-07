const express = require("express"),
    bodyParser = require("body-parser"),
    uuid = require("uuid");

const morgan = require("morgan");
const app = express();
    //integration of Mongoose with a REST API, requiring Mongoose and models
const mongoose = require("mongoose");
const Models = require("models.js");
const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;

//Express framework and its middleware 
const bodyParser = require("body-parser");
app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({ extended: true }));



const uuid = require("uuid");

//Middleware function
app.use(express.static("public"));
app.use(express.json());
app.use(morgan("common"));


//link to MondoDB database
mongoose.connect("mongodb://localhost:27017/myFlixDB",
    {   useNewUrlParser: true, 
        useUnifiedTopology: true 
    });



//Get req, welcome message as res
app.get("/", (req, res) =>{
    res.send("Hello, welcome to myFlix App.");
  });

app.get("/movies", (req, res) => {
    res.json(myMovies);
});

/*
app.get("/movies", (req, res) => {
    Movies.find()
    .then(movies => 
        res.json(movies));
    }); */
    
//GET all movies
/*app.get("/movies", (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});*/

app.get("/movies/:title", (req, res) => {
    let movie = myMovies.find((movie) => {
        return movie.title === req.params.title;
    });
    if(movie) {
        res.json(movie)
    } else {
        res.send("No movie found")
    }
});

app.get("/movies/:id?", (req, res) => {
    res.json(myMovies.find( (movie) =>
      { return movie.Name === req.params.name }));
  });
  

app.get("/movies/genres/:title", (req, res) => {
    res.send("Genre by name/title");
});

app.get("/movies/genre/:genre", (req, res) => {
    let movieByGenre = []
    myMovies.find((movie) => {
        if(movie.genre === req.params.genre) {
            movieByGenre.push(movie)
        }
    });
    res.json(movieList)
});

app.get("/movies/directors/:name", (req, res) => {
    res.send("Data about director by name");
});

app.post("/movies/users", (req, res) => {
    res.send("Registration confirmed");
});

app.get("/movies/users", (req, res) => {
    res.send("List of users")
});

app.put("/movies/users/:username", (req, res) => {
    res.send("Information updated");
});

// Get a user by username
/*
app.get('/users/:Username', (req, res) => {
    Users.findOne({ Username: req.params.Username })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });
*/

app.post("/movies/favorite/:movieName", (req, res) => {
    res.send("Movie added to favourites");
});

// Add a movie to a user's list of favorites
/*
app.post('/users/:Username/movies/:MovieID', (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
       $push: { FavoriteMovies: req.params.MovieID }
     },
     { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
  });
  */



app.delete("/movies/favorite/:deleteMovie", (req, res) => {
    res.send("Movie deleted from favourites");
});

app.delete("/movies/users/:username", (req, res) => {
    res.send("The account has been deleted");
});

// Update a user's info, by username
/*
app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }, // This line makes sure that the updated documents returned
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});
*/

app.get("/secreturl", (req, res) =>{
    res.send("This content is top SECRET")
});

//Add a user with JSON format
/*
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}
app.post("/users", (req, res) => {
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + "already exists");
        } else {
          Users
            .create({
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
  */

//documentation.html ti yse express.static


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