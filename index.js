
//Express framework and its middleware 
const express = require('express');
const morgan = require('morgan');
const app = express();


//list of movies as JSON object
let myMovies = [
    {
        title: 'Breaking Bad',
        year: 2008,
        genre: ['Action', 'Drama'],
    },
    {
        title: 'Game of Thrones',
        year: 2011,
        genre: ['Fantasy', 'Action', 'History'],
    },
    {
        title: 'The Office',
        year: 2001,
        genre: ['Comedy', 'Drama'],
    },
    {
        title: 'Six Feet Under',
        year: 2001,
        genre: ['Thriller', 'Drama'],
    },
    {
        title: 'Chernobyl ',
        year: 2019,
        genre: ['History', 'Science', 'Thriller'],
    },
    {
        title: 'Black Mirror',
        year: 2011,
        genre: ['Fantasy', 'Science', 'Drama'],
    },
    {
        title: 'Lost',
        year: 2004,
        genre: ['Fantasy', 'Action'],
    },
    {
        title: 'Downton Abbey ',
        year: 2010,
        genre: ['Drama', 'History'],
    },
    {
        title: 'Homeland ',
        year: 2011,
        genre: ['Drama', 'Action', 'Thriller'],
    },
    {
        title: 'The Big Bang Theory',
        year: 2007,
        genre: ['Comedy'],
    },
];

//Middleware functions to log log all requests and serve all static files on public
app.use (morgan('common'));
app.use(express.static('public')); 


//Get req, welcome message as res
app.get('/', (req, res) =>{
    res.send('Hello, welcome to myFlix App.');
  });
  
//Get doc req, res with express.static
app.get('/documentation', (req, res) => {
    res.sendFile ('/public/documentation.html', {root: __dirname });
});
  
//Get movies req, res json bobject
app.get('/movies', (req, res) =>{
res.json(myMovies);
});
  
//Error handler with log all function
app.use((err, req, res, next) => {
console.error(err.stack);
res.status(500).send('Error founded, fixt it!');
next();  
});
  
//Listens for requests, port 8080
app.listen(8080, () =>{
    console.log('This app is listening on port 8080.');
});