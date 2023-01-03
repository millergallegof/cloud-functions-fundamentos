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

// CronJobs
// metodo pub/sub -> 
// metodo schedule recibe como parametro el tiempo o en que periodo de tiempo se deb ejecutar la funcion
// este schedule recibe tanto lenguaje natural en ingles como codigos crontab revisar la siguiente pagina: https://crontab.guru/#5_4_04_*_*
// despues se ejecuta el metodo onRun donde se va a ejecutar todo el codigo que se va a ejecutar en determinado tiempo
// exports.cadaDosMinutos = functions.pubsub
//     .schedule('every 2 minutes')
//     .onRun(context => {
//         console.log('cron job ejecutado');
//         functions.logger.info('cron job ejecutado, paps')
//     })
