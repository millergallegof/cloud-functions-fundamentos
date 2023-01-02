const functions = require("firebase-functions");

// los bucket son donde se van almacenar los elementos en firebase o en google cloud
// onFinalice -> cuando se termine de subir un archivo
// onArchive -> archivar el elemento
// onDelete -> cuando se borra un archivo
// onUpdate -> se actualiza la metadata de los archivos
exports.fileAdd = functions.storage.object().onFinalize(async (object) => {
    functions.logger.info("onfinalize event");
    functions.logger.info(object.bucket);
    functions.logger.info(object.name);
    functions.logger.info(object.contentType);
    if (object.contentType.startsWith('image/')) {
        functions.logger.info('Procesando la imagen');
    }
    if (object.contentType.startsWith('application/')) {
        functions.logger.info('Procesando la aplicacion');
    }
});

exports.fileDelete = functions.storage.object().onDelete(async (object) => {
    functions.logger.info("onDelete event");
    functions.logger.info(object.bucket);
    functions.logger.info(object.name);
    functions.logger.info(object.contentType);
});
