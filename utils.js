/**
 * Helps parse options used in youtube-dl command.
 *
 * @param {Array.<String>}
 * @return {Array.<String>}
 */
exports.sendResponseDataWith = function (response, code, message, data){
    var status = code == 200 ? true : false
    var message = message
    if (!message) message = "Success"
    var responseData = {status: status, message: message, data: data } 
    response.status(code).send(responseData)
}
