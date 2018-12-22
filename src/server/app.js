const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const packageData = require('../../package.json')
const path = require('path')
const hash = require('hash.js')

const validateHash = (str, reqHash) => {
    let UUID = reqHash.substr(-36)
    return reqHash === hash.sha1().update(UUID + str).digest('hex') + '-' + UUID
}

app.use(express.static(path.resolve(__dirname, '..', '..', 'dist')))
app.use(bodyParser())
app.use(cors())

const MongoClient = require('mongodb').MongoClient

let db

let allowedKeys = {
    player: 'string',
    map: 'string',
    waveReached: 'number',
    enemiesKilled: 'number'
}

MongoClient.connect('mongodb://localhost:27017', (err, client) => {
    if (err) throw err

    db = client.db('game-2018')
    app.listen(3000, () => {
        // console.log('listening on 3000')
    })
})

const validateBody = body => {
    for (let key in body) {
        if (!allowedKeys.hasOwnProperty(key)) {
            return false
        }
    }
    for (let key in allowedKeys) {
        if (!body.hasOwnProperty(key) || typeof body[key] !== allowedKeys[key]) {
            return false
        }
    }
}

app.post('/highscores', (req, res) => {
    return new Promise((resolve, reject) => {
        let reqHash = (req.header('Authorization') || '').substr(7)
        let reqBody = req.body
        if (validateHash(reqHash)) {
            let uuid = reqHash.substr(-36)
            // is blacklisted
            if (db.collection('blacklist').findOne({ uuid })) {
                return reject(new Error('blacklisted'))
            }

            if (validateBody(reqBody)) {
                let data = {
                    ...reqBody,
                    uuid,
                    version: packageData.version
                }
                db.collection('highscores')
                    .insertOne(data, err => err ? reject(err) : resolve())
            } else {
                db.collection('blacklist')
                    .insertOne({ uuid }, () => resolve())
            }
        }
    }).then(() => {
        res.status(200).send(req.body)
    })
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
            res.send(results)
        })
})
