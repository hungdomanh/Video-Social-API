/* eslint-disable no-unused-vars */
import { Router } from 'express'
import validate from 'express-validation'
import HTTPStatus from 'http-status'

import * as movieController from './movieController'
import movieValidation from './movieValidation'
import * as authService from '../../services/authService'
import * as paramService from '../../services/paramService'
import * as ownMiddleware from '../../middlewares/ownMiddleware'
const router = new Router()

/**
 * GET /items/stats => stats
 * GET /items => index
 * GET /items/:id => show
 * POST /items/ => create
 * PATCH/PUT /items/:id => update
 * DELETE /items/:id => remove
 */

//  Default router
router
	.get(
		'/stats',
		validate(movieValidation.stats),
		movieController.getMoviesStats,
		function(req, res, next) {
			return res.status(HTTPStatus.OK).json({
				moviesStats: res.moviesStats
			})
		}
	)
	.get(
		'/',
		validate(movieValidation.index),
		paramService.parseParam,
		movieController.getMovies,
		function(req, res, next) {
			return res.status(HTTPStatus.OK).json({
				movies: res.movies,
				moviesMeta: res.moviesMeta
			})
		}
	)
	.get(
		'/:id',
		validate(movieValidation.show),
		movieController.getMovieById,
		function(req, res, next) {
			return res.status(HTTPStatus.OK).json({
				movie: res.movie
			})
		}
	)
	.post(
		'/',
		validate(movieValidation.create),
		authService.authJwt,
		movieController.createMovie,
		function(req, res, next) {
			return res.status(HTTPStatus.OK).json({
				movie: res.movie
			})
		}
	)
	.put(
		'/:id',
		validate(movieValidation.update),
		ownMiddleware.ownMovie,
		movieController.updateMovie,
		function(req, res, next) {
			return res.status(HTTPStatus.OK).json({
				movie: res.movie
			})
		}
	)
	.delete(
		'/:id',
		validate(movieValidation.delete),
		movieController.deleteMovie,
		function(req, res, next) {
			return res.sendStatus(HTTPStatus.OK)
		}
	)

// More router

export default router
