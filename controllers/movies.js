const Movie = require('../models/movie');
const BadReqError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');
const {
  BAD_REQUEST_ERROR,
  NOT_FOUND_MOVIE_ERROR_MESSAGE,
  FORBIDDEN_DELETE_MOVIE_MESSAGE,
} = require('../utils/constants');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .populate('user')
    .then((movies) => {
      res.status(200).send(movies);
    })
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  Movie.create({ owner: req.user._id, ...req.body })
    .then((movie) => {
      res.status(201).send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadReqError(BAD_REQUEST_ERROR);
      }
      if (err.name === 'MongoError' || err.code === 11000) {
        throw new ConflictError(err.message);
      }
    })
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(new Error('NotFound'))
    .catch((err) => {
      if (err.message === 'NotFound') {
        throw new NotFoundError(NOT_FOUND_MOVIE_ERROR_MESSAGE);
      }
    })
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError(FORBIDDEN_DELETE_MOVIE_MESSAGE);
      } else {
        Movie.findByIdAndDelete(req.params.movieId)
          .then((deleteMovie) => {
            res.status(200).send(deleteMovie);
          });
      }
    })
    .catch(next);
};
