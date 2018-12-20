var express = require('express')
var bodyParser = require('body-parser')
var app = express()

app.use(express.static('dist'))
app.use(bodyParser())

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

    db = client.db('scores')
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
                            if (typeof req.body[allowedKey] !== 'string') {
                                check = false
                            }
                            break
                        case 'waveReached':
                        case 'enemiesKilled':
                        case 'map':
                            if (typeof req.body[allowedKey] !== 'number') {
                                check = false
                            }
                            break
                    }
                })
            }
        })
        if (check) {
            db.collection('highscores').insertOne(req.body, (err, result) => {
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
    db.collection('highscores').find().toArray((err, results) => {
        if (err) throw err
        // eslint-disable-next-line no-console
        console.log(results)
        res.send(results)
    })
})
