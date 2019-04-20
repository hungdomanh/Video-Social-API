/* eslint-disable no-unused-vars */
import { Router } from 'express'
import validate from 'express-validation'
import HTTPStatus from 'http-status'

import * as userController from './userController'
import * as friendController from '../friend/friendController'
import userValidation from './userValidation'
import { authLocal, authFacebook, authJwt } from '../../services/authService'
import * as paramMiddleware from '../../middlewares/paramMiddleware'
import * as ownMiddleware from '../../middlewares/ownMiddleware'
import { accessControl } from '../../middlewares/roleMiddleware'
const router = new Router()

/**
 * GET /items/stats => getUsersStats
 * GET /items => getUsers
 * GET /items/:id => getUserById
 * POST /items/ => createUser
 * PATCH/PUT /items/:id => updateUser
 * DELETE /items/:id => deleteUser
 */

// More router
router
	.get('/current', accessControl('createOwn', 'user'), function(
		req,
		res,
		next
	) {
		return res.status(HTTPStatus.OK).json({
			user: req.user
		})
	})
	.get(
		'/:id/movies/own',
		accessControl('readOwn', 'movie'),
		paramMiddleware.parseParamList,
		userController.getMoviesOwn,
		function(req, res, next) {
			return res.status(HTTPStatus.OK).json({
				data: res.movies,
				pagination: res.pagination
			})
		}
	)
	.get(
		'/:id/movies/liked',
		accessControl('readOwn', 'like'),
		paramMiddleware.parseParamList,
		userController.getMoviesLiked,
		function(req, res, next) {
			return res.status(HTTPStatus.OK).json({
				data: res.movies,
				pagination: res.pagination
			})
		}
	)
	.get(
		'/:id/movies/followed',
		accessControl('readOwn', 'movie'),
		paramMiddleware.parseParamList,
		userController.getMoviesFollowed,
		function(req, res, next) {
			return res.status(HTTPStatus.OK).json({
				data: res.movies,
				pagination: res.pagination
			})
		}
	)
	.get(
		'/:id/groups/own',
		accessControl('readOwn', 'group'),
		paramMiddleware.parseParamList,
		userController.getGroupsOwn,
		function(req, res, next) {
			return res.status(HTTPStatus.OK).json({
				data: res.groups,
				pagination: res.pagination
			})
		}
	)
	.get(
		'/:id/groups/:status',
		accessControl('readOwn', 'group'),
		validate(userValidation.groupsStatus),
		paramMiddleware.parseParamList,
		userController.getGroupsStatus,
		function(req, res, next) {
			return res.status(HTTPStatus.OK).json({
				data: res.groups,
				pagination: res.pagination
			})
		}
	)
	.get(
		'/:id/followers',
		accessControl('readOwn', 'followUser'),
		paramMiddleware.parseParamList,
		userController.getFollowers,
		function(req, res, next) {
			return res.status(HTTPStatus.OK).json({
				data: res.followers,
				pagination: res.pagination
			})
		}
	)
	.get(
		'/:id/followed',
		accessControl('readOwn', 'followUser'),
		paramMiddleware.parseParamList,
		userController.getFollowed,
		function(req, res, next) {
			return res.status(HTTPStatus.OK).json({
				data: res.followed,
				pagination: res.pagination
			})
		}
	)
	.get(
		'/:id/friends',
		accessControl('readOwn', 'friend'),
		paramMiddleware.parseParamList,
		userController.getFriends,
		function(req, res, next) {
			return res.status(HTTPStatus.OK).json({
				data: res.followers,
				pagination: res.pagination
			})
		}
	)
	.get(
		'/:id/friends/requests',
		accessControl('readOwn', 'friend'),
		paramMiddleware.parseParamList,
		userController.getFriendsRequests,
		function(req, res, next) {
			return res.status(HTTPStatus.OK).json({
				data: res.followed,
				pagination: res.pagination
			})
		}
	)
	.post(
		'/signup',
		validate(userValidation.create),
		userController.createUser,
		friendController.createFriend,
		function(req, res, next) {
			return res.status(HTTPStatus.OK).json({
				user: req.user
			})
		}
	)
	.post('/login', authLocal, userController.localLogin, function(
		req,
		res,
		next
	) {
		return res.status(HTTPStatus.OK).json({
			user: req.user
		})
	})
	.get('/auth/facebook', authFacebook)
	.get(
		'/auth/facebook/callback',
		authFacebook,
		userController.facebookLogin,
		function(req, res, next) {
			return res.status(HTTPStatus.OK).json({
				user: req.user
			})
		}
	)

//  Default Rest router
router
	.get(
		'/stats',
		validate(userValidation.stats),
		userController.getUsersStats,
		function(req, res, next) {
			return res.status(HTTPStatus.OK).json({
				usersStats: res.usersStats
			})
		}
	)
	.get(
		'/',
		accessControl('readAny', 'user'),
		paramMiddleware.parseParamList,
		validate(userValidation.index),
		userController.getUsers,
		function(req, res, next) {
			return res.status(HTTPStatus.OK).json({
				data: res.users,
				pagination: res.pagination
			})
		}
	)
	.get(
		'/:id',
		validate(userValidation.show),
		userController.getUserById,
		function(req, res, next) {
			return res.status(HTTPStatus.OK).json({
				data: res.user
			})
		}
	)
	.post(
		'/',
		validate(userValidation.create),
		userController.createUser,
		function(req, res, next) {
			return res.status(HTTPStatus.OK).json({
				user: req.user
			})
		}
	)
	.put(
		'/:id',
		validate(userValidation.update),
		userController.updateUser,
		function(req, res, next) {
			return res.status(HTTPStatus.OK).json({
				data: res.user
			})
		}
	)
	.delete(
		'/:id',
		validate(userValidation.delete),
		userController.deleteUser,
		function(req, res, next) {
			return res.sendStatus(HTTPStatus.OK)
		}
	)

export default router
