const express = require('express')
const router = express.Router()

const User = require('../models/user.model')

const checkLoggedIn = (req, res, next) => req.isAuthenticated() ? next() : res.render('index', { loginErrorMessage: 'Please, log in or sign up to access' })

const isLogged = (req) => req.isAuthenticated() === true
const isNotLogged = (req) => req.isAuthenticated() === false



router.get('/profile', checkLoggedIn, (req, res) => {
    // INCLUIR ID DE USUARIO
    res.render('user/user-profile', { user: req.user, isLogged: isLogged(req) })
})




// EDITAR PERFIL

router.get('/profile/edit', checkLoggedIn, (req, res, next) => {
    const userId = req.query.id

    User.findById(userId)
        .then(user => res.render('user/edit-profile', { user, isLogged: isLogged(req) }))
        .catch(err => next(err))
})

router.post('/profile/edit', checkLoggedIn, (req, res, next) => {
    const userId = req.query.id
    const {name, email, about, img} = req.body

    User.findByIdAndUpdate(userId, { name, email, about, img })
        .then(user => res.render('user/user-profile', { user, isLogged: isLogged(req) }))
        .catch(err => next(err))
})




// ELIMINAR PERFIL

router.get('/profile/delete', checkLoggedIn, (req, res, next) => {
    const userId = req.query.id
    
    User.findById(userId)
        .then(user => res.render('user/delete-profile', { user, isLogged: isLogged(req) }))
        .catch(err => next(err))
})

router.post('/profile/delete', checkLoggedIn, (req, res, next) => {
    const userId = req.query.id

    User.findByIdAndDelete(userId)
        .then(() => res.redirect('/'))
        .catch(err => next(err)) 
})




// VISUALIZE CONTENT

router.get('/profile/watchlist', checkLoggedIn, (req, res, next) => {
    User
        .findById(req.query.id)
        .populate('watchlist.movies', 'watchlist.series')
        .then(user => res.render('user/user-watchlist', {user, isLogged: isLogged(req) }))
        .catch(err => next(err))
})


router.get('/profile/seen', checkLoggedIn, (req, res, next) => {
    User
        .findById(req.query.id)
        .populate('seen.movies', 'seen.series')
        .then(user => res.render('user/user-seen', {user, isLogged: isLogged(req) }))
        .catch(err => next(err))
})


router.get('/profile/likes', checkLoggedIn, (req, res, next) => {
    User
        .findById(req.query.id)
        .populate('likes.movies', 'likes.series')
        .then(user => res.render('user/user-likes', {user, isLogged: isLogged(req) }))
        .catch(err => next(err))
})






module.exports = router