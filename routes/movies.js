const router = require('express').Router();
const { createMovieValidation, deleteMovieValidation } = require('../middlewares/validations');

const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

router.get('/movies', getMovies);

router.post('/movies', createMovieValidation, createMovie);

router.delete('/movies/:movieId', deleteMovieValidation, deleteMovie);

module.exports = router;
