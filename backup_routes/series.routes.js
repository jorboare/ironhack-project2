const express = require('express')
const router = express.Router()

const Series = require('../models/series.model.js')
const User = require('../models/user.model')

const axios = require('axios')
const apiHandler = axios.create({
    baseURL: "https://api.themoviedb.org/3"
})



const isLogged = (req) => req.isAuthenticated() === true
const isNotLogged = (req) => req.isAuthenticated() === false





// ALL SERIES INDEX

router.get('/', (req, res, next) => {

    apiHandler
        .get(`/tv/popular?api_key=95ad659b54a1464fdb415db2270f7402`)
        .then(allSeries => res.render('data/series', { allSeries: allSeries.data.results, isLogged: isLogged(req), isNotLogged: isNotLogged(req) }))
        .catch(err => next(err))

    // Series
    //     .find()
    //     .sort({ popularity: -1 })
    //     .then(allSeries => {
    //         res.render('data/series', { allSeries, isLogged: isLogged(req), isNotLogged: isNotLogged(req) })
    //     })
    //     .catch(err => next(err))
})




// INDIVIDUAL SERIES DETAILS

router.get('/:id', (req, res, next) => {

    console.log(req.params.id)
    apiHandler
        .get(`/tv/${req.params.id}?api_key=95ad659b54a1464fdb415db2270f7402`)
        .then(serie => {
            apiHandler
                .get(`/tv/${req.params.id}/credits?api_key=95ad659b54a1464fdb415db2270f7402`)
                .then(serieCredits => {
                    const credits = serieCredits.data.cast
                    const orderedCredits = credits.sort((a, b) => {
                        if (a.popularity > b.popularity) {
                            return -1
                        }
                        if (a.popularity < b.popularity) {
                            return 1
                        }
                        return 0
                    })
                    const topPopularActors = orderedCredits.splice(0, 10)
                    const thisSerie = serie.data
                    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                    const date = thisSerie.first_air_date
                    const serieDate = {
                        day: date.slice(8),
                        month: months[date.slice(5, 7)],
                        year: date.slice(0, 4)
                    }
                    console.log(serie.data)

                    res.render('data/serie-detail', { thisSerie, topPopularActors, first_air_date: serieDate, isLogged: isLogged(req), isNotLogged: isNotLogged(req) })
                })

        })
        .catch(err => next(err))

    // Series
    //     .findById(req.params.id)
    //     .then(thisSerie => {
    //         const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    //         const serieDate = {
    //             day: thisSerie.first_air_date.getDate(),
    //             month: months[thisSerie.first_air_date.getMonth()],
    //             year: thisSerie.first_air_date.getFullYear()
    //         }
    //         res.render('data/serie-detail', { thisSerie, first_air_date: serieDate, isLogged: isLogged(req), isNotLogged: isNotLogged(req) })
    //     })
    //     .catch(err => next(err))
})




// ADD SERIES TO USER'S LISTS

router.post('/:id', (req, res, next) => {
    
    apiHandler
        .get(`/tv/${req.params.id}?api_key=95ad659b54a1464fdb415db2270f7402`)
        .then(theSeries => {
            const seriesWL = req.user.apilists.watchlist.series
            const seriesSN = req.user.apilists.seen.series
            const seriesLK = req.user.apilists.likes.series
            const newObj = { db_id: theSeries.data.id, name: theSeries.data.name, poster_path: theSeries.data.poster_path }

            if (req.query.add === 'watchlist') {
                let newList = [...seriesWL, newObj]
                User
                    .findByIdAndUpdate(req.user.id, { "apilists.watchlist.series": newList })
                    .then(() => res.redirect('/series'))
                    .catch(err => next(err))
                
            } else if (req.query.add === 'seen') {
                let newList = [...seriesSN, newObj]
                User
                    .findByIdAndUpdate(req.user.id, { "apilists.seen.series": newList })
                    .then(() => res.redirect('/series'))
                    .catch(err => next(err))
                
            } else if (req.query.add === 'likes') {
                let newList = [...seriesLK, newObj]
                User
                    .findByIdAndUpdate(req.user.id, { "apilists.likes.series": newList })
                    .then(() => res.redirect('/series'))
                    .catch(err => next(err))
            }
            console.log('LA SERIE:', theSeries, 'NUEVO OBJETO', newObj)
        })
        .catch(err => next(new Error(err)))
    // const seriesWL = req.user.seedslists.watchlist.series
    // const seriesSN = req.user.seedslists.seen.series
    // const seriesLK = req.user.seedslists.likes.series

    // if (req.query.add === 'watchlist') {
    //     let newList = [...seriesWL, req.params.id]

    //     User
    //         .findByIdAndUpdate(req.user.id, { "seedslists.watchlist.series": newList })
    //         .then(() => res.redirect('/series'))
    //         .catch(err => next(err))
        
    // } else if (req.query.add === 'seen') {
    //     let newList = [...seriesSN, req.params.id]

    //     User
    //         .findByIdAndUpdate(req.user.id, { "seedslists.seen.series": newList })
    //         .then(() => res.redirect('/series'))
    //         .catch(err => next(err))
        
    // } else if (req.query.add === 'likes') {
    //     let newList = [...seriesLK, req.params.id]

    //     User
    //         .findByIdAndUpdate(req.user.id, { "seedslists.likes.series": newList })
    //         .then(() => res.redirect('/series'))
    //         .catch(err => next(err))
    // }
})




module.exports = router