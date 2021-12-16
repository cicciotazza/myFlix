//Express framework and its middleware 
const express = require('express');
const morgan = require('morgan');
const app = express();
const uuid = require('uuid');

//Middleware function
app.use(express.static('public'));
app.use(express.json());
app.use(morgan('common'));

bodyParser = require('body-parser');
app.use(bodyParser.json());


//list of movies as JSON object
let myMovies = [
    {
        id: 1,
        title: 'Breaking Bad',
        year: 2008,
        genre: ['Action', 'Drama'],
    },
    {   
        id: 2,
        title: 'Game of Thrones',
        year: 2011,
        genre: ['Fantasy', 'Action', 'History'],
    },
    {
        id: 3,
        title: 'The Office',
        year: 2001,
        genre: ['Comedy', 'Drama'],
    },
    {
        id: 4,
        title: 'Six Feet Under',
        year: 2001,
        genre: ['Thriller', 'Drama'],
    },
    {
        id: 5,
        title: 'Chernobyl',
        year: 2019,
        genre: ['History', 'Science', 'Thriller'],
    },
    {
        id: 6,
        title: 'Black Mirror',
        year: 2011,
        genre: ['Fantasy', 'Science', 'Drama'],
    },
    {
        id: 7,
        title: 'Lost',
        year: 2004,
        genre: ['Fantasy', 'Action'],
    },
    {
        id: 8,
        title: 'Downton Abbey ',
        year: 2010,
        genre: ['Drama', 'History'],
    },
    {
        id: 9,
        title: 'Homeland ',
        year: 2011,
        genre: ['Drama', 'Action', 'Thriller'],
    },
    {
        id: 10,
        title: 'The Big Bang Theory',
        year: 2007,
        genre: ['Comedy'],
    },
];

//Get req, welcome message as res
app.get('/', (req, res) =>{
    res.send('Hello, welcome to myFlix App.');
  });

app.get('/movies', (req, res) => {
    res.json(myMovies);
});

app.get('/movies/:title', (req, res) => {
    let movie = movie.find((movie) => {
        return movie.title === req.params.title;
    });
    if(movie) {
        res.json(movie)
    } else {
        res.send('No movie found')
    }
});

app.get('/movies/:id?', (req, res) => {
    res.json(myMovies.find( (movie) =>
      { return movie.name === req.params.name }));
  });
  
/* ---not working either---
app.get('/movies/:id', function(req, res) {
    responsemyMovies = req.params.id== undefined ?
    myMovies.filter( function(obj) {return obj.it== req.params.id} )
    : myMovies;
    res.json(responsemyMovies) 
  }); 

   */

app.get('/movies/genres/:title', (req, res) => {
    res.send('Genre by name/title');
});

app.get('/movies/genre/:genre', (req, res) => {
    let movieByGenre = []
    myMovies.find((movie) => {
        if(movie.genre === req.params.genre) {
            movieByGenre.push(movie)
        }
    });
    res.json(movieList)
});

app.get('/movies/directors/:name', (req, res) => {
    res.send('Data about director by name');
});

app.post('/movies/users', (req, res) => {
    res.send('Registration confirmed');
});

app.get('/movies/users', (req, res) => {
    res.send('List of users')
});

app.put('/movies/users/:username', (req, res) => {
    res.send('Information updated');
});

app.post('/movies/favorite/:movieName', (req, res) => {
    res.send('Movie added to favourites');
});

app.delete('/movies/favorite/:deleteMovie', (req, res) => {
    res.send('Movie deleted from favourites');
});

app.delete('/movies/users/:username', (req, res) => {
    res.send('The account has been deleted');
});

app.get('/secreturl', (req, res) =>{
    res.send('This content is top SECRET')
});

//Error handler with log all function
app.use((err, req, res, next) => {
console.error(err.stack);
res.status(500).send('Error founded, fix it!');
next();  
});

//Listens for requests, port 8080
app.listen(8080, () =>{
    console.log('This app is listening on port 8080.');
});