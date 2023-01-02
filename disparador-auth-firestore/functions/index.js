/* antes de comenzar a realizar cloud functions se deben hacer unos cuantos pasos para
    inicializar el servidor

    1. inicialmente se tiene que instalar firebse tools de manera global con 
    npm i -g firebase-tools
    2. se debe loguearse con firebase si aun no se ha logueado con el comando
    firebase login
    este comando lo llevara a la pagina de firebase para que se logue y de la autorizacion
    3. despues se inicializa el proyecto de firebase con el comando
    firebase init
    esto le dara varias opciones de parametrizacion dependiendo su preferencia se crea o selecciona el proyecto que se 
    le desea dar las cloud functions
    4. se inicializa el proyecto con el siguiente comando
    firebase init functions -
    lo que inicializa las cloud functions y crea un sub proyecto donde se van a crear estas functions
    5. se configura el emulador el cual va a servir como una especie de backend en la nube para ejecutar las functions
    firebase init emulators
    se seleccionan que servicios se desean emular y los diferentes puertos donde se va a ejecutar
    6. finalmente se ejecuta el emulador con el siguiente comando
    firebase emulators:start
    esto crea los diferentes servidores de manera local para ejecutar las diferents servicios
    7. se crean las diferentes funciones con los disparadores como se muestra en este archivo
    8. se hace un deploy de las funciones para que se puedan utilizar en toda la aplicacion con el siguiente comando
    firebase deploy --only functions
    esto hace el deploy de solo las funciones
*/


const functions = require("firebase-functions");
const admin = require('firebase-admin');

// se inicializan las diferentes funciones utilizando esto
// cabe aclarar que estas funciones se pueden utilizar en otros proyectos
admin.initializeApp()

// para exportar estas funciones se debe poner exports
// esta funcion basicamente utiliza el disparador de crear un usuario
exports.welcomeUser = functions.auth.user().onCreate(async (user) => {
    // debe retornar promesas ya que estas peticiones se manejan de manera asincrona
    return new Promise((resolve, reject) => {
        console.log(`Bienvenido ${user.displayName}`);
        resolve(true)
    })
})

exports.DeleteUser = functions.auth.user().onDelete(async (user) => {
    return new Promise((resolve, reject) => {
        console.log(`Hasta pronto ${user.displayName}`);
        // se pueden eliminar datos de la base de datos cuando se elimina un usuario
        resolve(true)
    })
})

// disparador Firestore -> cuando se modifica de alguna manera la bd firestore
// esta funcion se dispara cuando se crea un documento en la coleccion invoices
exports.calculateInvoice = functions.firestore
    .document('invoices/{invoiceid}')
    .onCreate((snapshot, context) => {
        console.log(snapshot);
        const invoiceId = context.params.invoiceid
        const total = snapshot.data().total;
        const taxes = snapshot.data().taxes;
        const totalInvoice = total + taxes
        const firestore = admin.firestore()

        return firestore.doc(`invoices/${invoiceId}`).set(
            {
                totalInvoice: totalInvoice
            },
            {
                merge: true
            }
        )
    })

exports.updateInvoice = functions.firestore
    .document('invoices/{invoiceid}')
    .onUpdate((change, context) => {
        // change tiene la propiedad del valor actual y el valor anterior para utilizar
        const newValue = change.after.data()
        const previosValue = change.before.data()
        const invoiceId = context.params.invoiceid
        const total = newValue.total;
        const taxes = newValue.taxes;
        const totalInvoice = total + taxes

        return change.after.ref.update(
            {
                totalInvoice: totalInvoice
            }
        )
    })

exports.deleteInvoice = functions.firestore
    .document('invoices/{invoiceid}')
    .onDelete((snap, context) => {
        console.log('el invoice fue eliminado');
        console.log(snap);
    })
