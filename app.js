const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "moviesData.db");
let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3001, () => {
      console.log("Server Running in port: 3001");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

//tables names movie, director..
//movie: movie_id, director_id, movie_name, lead_actor
//director: director_id, director_name

// all api calls..
//api1 get path: /movies/ returns all movies..
// async await are necessary to get the response in time..
app.get("/movies/", async (request, response) => {
  const getMoviesQuery = `
    select movie_name from movie`;
  const moviesArray = await db.all(getMoviesQuery);
  response.send(moviesArray);
});

//api2 post path: /movies/ movie_id auto-incremented.
//response Movie Successfully Added
app.post("/movies/", async (request, response) => {
  let movieDetails = request.body;
  const { movie_id, director_id, movie_name, lead_actor } = movieDetails;
  const addMovieQuery = `
    INSERT INTO movie
    ('movie_id', 'director_id', 'movie_name', 'lead_actor')
    values(
        ${movie_id},
        ${director_id},
        '${movie_name}',
        '${lead_actor}');`;
  await db.run(addMovieQuery);
  response.send("Movie Successfully Added");
});

//api3 get path: /movies/:movieId/
app.get("/movies/:movie_id", async (request, response) => {
  const { movie_id } = request.params;
  console.log(movie_id);
  const getMoviesQuery = `
    select * from movie
    where movie_id = ${movie_id}`;
  const moviesArray = await db.all(getMoviesQuery);
  response.send(moviesArray);
});

//api4 put path: /movies/:movieId/ updates..
//Response: Movie Details Updated
app.put("/movies/:movieId", async (request, response) => {
  const { movieId } = request.params;
  const movieToChange = request.body;
  const { movie_id, director_id, movie_name, lead_actor } = movieToChange;
  const updateMovieQuery = `
    update movie
    set 
       movie_id = ${movie_id},
       director_id = ${director_id},
       movie_name = '${movie_name}',
       lead_actor = '${lead_actor}'
    where movie_id = ${movieId};`;
  await db.run(updateMovieQuery);
  response.send("Movie Details Updated");
});

//api5 delete path: /movies/:movieId/
//response Movie Removed
app.delete("/movie/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  console.log(movieId);
  const deleteMovieQuery = `
    delete from movie
    where movie_id = ${movieId};`;
  try {
    await db.run(deleteMovieQuery);
  } catch (e) {
    console.log(e);
  }

  response.send("Movie Removed");
});

//api6 get path: /directors/
app.get("/directors/", async (request, response) => {
  const getMoviesQuery = `
    select * from movie`;
  const moviesArray = await db.all(getMoviesQuery);
  response.send(moviesArray);
});
//api7 get path: /directors/:directorId/movies/

module.exports = app;
