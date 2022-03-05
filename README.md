 # myFlix API
  It is a **REST API** that executes CRUS operations on a non-relational database to provide a **complete back end for a movie web application**. The database contains a movies collection holding data about a variety of tv-shows, as well as a users collection with data about registered users of applications that consume the API. 

CRUD operations can be performed on the data by sending HTTP requests to the API endpoints. 
These are documented in detail here: [myFlix API endpoints](https://herokumyflixdb.herokuapp.com/documentation).

- A movie app using React is available [here](https://cicciotazza-myflix.netlify.app/).

- A movie app using Angular is available [here](https://cicciotazza.github.io/myFlix-Angular-client/).

- myFlix was built using Node.js and the Express framework and is hosted on [Heroku](https://www.heroku.com/). The database is hosted on [MongoDB Atlas](https://www.mongodb.com/atlas/database). 

- Full application documentation is included in the [out](https://github.com/cicciotazza/myFlix/tree/main/out) folder of the project repository.

## Target

To build the server-side component of a “movies” web application. The web application will provide users with access to information about different movies, directors, and genres. Users will be able to sign up, update their personal information, and create a list of their favorite movies 
 
## Languages used
- HTML
- CSS
- Javascript
- Node.js
- Express
- Mongoose
- Passport
- MondoDB Atlas
- Heroku
- jsonwebtoken
- 
## Creator
- [Github](https://github.com/cicciotazza)
- Linkedin (to be filled)

## Tools used
- Visual Studio Code
- GitHub Desktop
- NodeJs.
- Windows PowerShell 

## Installation and set up

This project requires Node.js to be installed. It is strongly suggested to use a lts version, check it with 
```
node -v
```
The documentation can be found [here](https://nodejs.org/en/).

To install myFlix run: 
```
npm install
```
- This command will provide the required modules to set up the application. Next, create a unique database for your specific project and decide where your API will be hosted. 

- A database can be created and hosted locally using MongoDB or hosted using MongoDB Atlas, where you can also create databases and collections directly. In order to recreate myFlix, two collections must be created: movies and users. Movies can be populated with movie data of your choice following the movieSchema defined in the models.js file. Similarly, any manual user records created should follow the userSchema.

- Once the database has been set up, the mongoose connect method in the index.js file must be updated to replace the current URI string with the URI of your database. Similarly, the port reference defined when setting up the server must be configured to reflect where the API is hosted. In the current code, the database URI and port number reference environment variables stored on Heroku and it is recommended environment variables saved outside git are used for these values to keep your application secure.

- To launch myFlix locally run alternatively:
```
npm start
```
```
node index.js
```

## Exercises
**Task01**
*Set up your project directory*

**Task02**
*Practice writing Node.js syntax and modules*

**Task03**
*Create a “package.json” file*
*Import all necessary packages into project directory*
*Define your project dependencies*

**Task04**
*Route HTTP requests for your project using Express*

**Task05**
*Define the endpoints for your REST API*

**Task06**
*Relational Databases & SQL*

**Task07**
*Non-Relational Databases & MongoDB*

**Task08**
*The Business Logic Layer*

**Task09**
*Authentication & Authorization*

**Task10**
*Data Security, Validation & Ethics*