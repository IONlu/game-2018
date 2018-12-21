var express = require('express')
var bodyParser = require('body-parser')
var cors = require('cors')
var app = express()
var packageData = require('../../package.json')
var path = require('path')

app.use(express.static(path.resolve(__dirname, '..', '..', 'dist')))
app.use(bodyParser())
app.use(cors())

const MongoClient = require('mongodb').MongoClient

let db

let allowedKeys = [
    'player',
    'waveReached',
    'enemiesKilled',
    'map'
]

MongoClient.connect('mongodb://localhost:27017', (err, client) => {
    if (err) throw err

    db = client.db('game-2018')
    app.listen(3000, () => {
        // console.log('listening on 3000')
    })
})

app.post('/highscores', (req, res) => {
    if (req.body) {
        let check = true
        Object.keys(req.body).forEach((key) => {
            if (!allowedKeys.includes(key)) {
                check = false
            } else {
                allowedKeys.forEach((allowedKey) => {
                    switch (allowedKey) {
                        case 'player':
                        case 'map':
                            if (typeof req.body[allowedKey] !== 'string') {
                                check = false
                            }
                            break
                        case 'waveReached':
                        case 'enemiesKilled':
                            if (typeof req.body[allowedKey] !== 'number') {
                                check = false
                            }
                            break
                    }
                })
            }
        })
        if (check) {
            let data = {
                ...req.body,
                version: packageData.version
            }
            db.collection('highscores').insertOne(data, (err, result) => {
                if (err) throw err
                db.collection('highscores').find({
                    '_id': result.insertedId
                }).toArray((err, results) => {
                    if (err) throw err
                    res.status(200).send(results)
                })
            })
        } else {
            res.status(400).send()
        }
    }
})

app.get('/highscores', (req, res) => {
    db.collection('highscores')
        .find()
        .sort({
            waveReached: -1
        })
        .limit(10)
        .toArray((err, results) => {
            if (err) throw err
            // eslint-disable-next-line no-console
            res.send(results)
        })
})
