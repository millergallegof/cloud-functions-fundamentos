const functions = require("firebase-functions");
const admin = require('firebase-admin');

admin.initializeApp()

// los disparadores tipo onRequest tienen como parametro los mismo que tiene una peticion http
exports.createDocu = functions.https.onRequest((req, res) => {
    // modificando elementos de la firestore desde las cloud functions
    return admin
        .firestore()
        .collection('cloud')
        .add({
            nombre: req.body.nombre,
            apellido: req.body.apellido
        })
        .then(() => {
            res.status(200).send({ status: `document creado ${req.body.nombre}` })
        })
        .catch(err => {
            res.status(500).send({ status: 'error', err })
        })
})

// disparador onCall -> son elementos que se pueden utilizar dentro de la aplicacion

exports.addCustomclaim = functions.https.onCall((data, context) => {
    return admin
        .auth()
        .setCustomUserClaims(data.uid, {
            admin: true
        })
        .then(() => {

        })
        .catch(() => {

        })
})