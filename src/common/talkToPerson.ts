const util = require("util");

const createResponse = function (formatMessage: string, name: string) {
    if (name) {
        return {
            body: util.format(formatMessage, name)
        }
    } else {
        return {
            status: 400,
            body: "No person to talk to. Please pass a name on the query string or in the request body."
        }
    }
}

export { createResponse }