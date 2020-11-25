const express = require('express')
const router = express.Router()

const Movie = require('../models/movie.model')
const User = require('../models/user.model')

const isLogged = (req) => req.isAuthenticated() === true
const isNotLogged = (req) => req.isAuthenticated() === false


// ALL MOVIES INDEX

router.get('/', (req, res, next) => {

    Movie
        .find()
        .sort({ popularity: -1 })
        .then(allMovies => res.render('data/movies', { allMovies, isLogged: isLogged(req), isNotLogged: isNotLogged(req) }))
        .catch(err => next(err))
})

//SEARCH
router.post('/', (req, res, next) => {

    const { search } = req.body
    const searchCleaned = search.replace(/\s/g, '%20')
    console.log(search)

    console.log(regex)
    Movie
        .find({ title: regex })
        .sort({ popularity: -1 })
        .then(searchResults => {
            res.render('data/movies', { searchResults, isLogged: isLogged(req), isNotLogged: isNotLogged(req) })
        })
        .catch(err => next(err))
})


// INDIVIDUAL MOVIE DETAILS

router.get('/:id', (req, res, next) => {


    Movie
        .findById(req.params.id)
        .then(thisMovie => {
            const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            const movieDate = {
                day: thisMovie.release_date.getDate(),
                month: months[thisMovie.release_date.getMonth()],
                year: thisMovie.release_date.getFullYear()
            }
            res.render('data/movie-detail', { thisMovie, release_date: movieDate, isLogged: isLogged(req), isNotLogged: isNotLogged(req) })
        })
        .catch(err => next(err))
})




// ADD MOVIE TO USER'S LISTS

// router.post('/:id', (req, res, next) => {
// const moviesWL = req.user.watchlist.movies
// const moviesSN = req.user.seen.movies
// const moviesLK = req.user.likes.movies

// if (req.query.add === 'watchlist') {
//     let newList = [...moviesWL, req.params.id]

//     User
//         .findByIdAndUpdate(req.user.id, { "watchlist.movies": newList })
//         .then(() => res.redirect('/movies'))
//         .catch(err => next(err))

// } else if (req.query.add === 'seen') {
//     let newList = [...moviesSN, req.params.id]

//     User
//         .findByIdAndUpdate(req.user.id, { "seen.movies": newList })
//         .then(() => res.redirect('/movies'))
//         .catch(err => next(err))

// } else if (req.query.add === 'likes') {
//     let newList = [...moviesLK, req.params.id]

//     User
//         .findByIdAndUpdate(req.user.id, { "likes.movies": newList })
//         .then(() => res.redirect('/movies'))
//         .catch(err => next(err))
// }
// })




module.exports = router