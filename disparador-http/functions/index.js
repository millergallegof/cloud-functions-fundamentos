const functions = require("firebase-functions");
const express = require('express');
const cors = require('cors');

const app = express()
app.use(cors({ origin: true }))

app.get('/:id', (req, resp) => resp.send(getUserById(req.params.id)))
app.post('/', (req, resp) => {
    createUser(req.body.name, req.body.email)
    resp.status(201).send({ successful: true })

})


// disparador request
// request es una peticion http no importa cual

exports.createUser = functions.https.onRequest((req, resp) => {
    functions.logger.info(req.body.name)
    functions.logger.info(req.body.email)
    functions.logger.info(req.body.phone)

    resp.status(200).json({ successful: true })
})


const getUserById = (userId) => {
    return {
        id: userId,
        name: "Miller Gallego",
        email: 'miller.gallegof@gmail.com'
    }
}

const createUser = (name, email) => {
    return {
        id: '121',
        name: name,
        email: email
    }
}