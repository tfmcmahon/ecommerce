'use strict'
 
//error handler boilerplate

// Get unique error field name
const uniqueMessage = error => {
    let output
    
    try {
        let fieldName = error.errmsg.substring(
            error.errmsg.lastIndexOf('index: ') + 7,
            error.errmsg.lastIndexOf('_1')
        )
        output = fieldName + ' already in use.'
    } catch (ex) {
        output = 'Unique field already in use.'
    }
 
    return output
}
 
// Get the erroror message from error object
exports.errorHandler = error => {
    let message = ''
    if (error.code) {
        switch (error.code) {
            case 11000:
            case 11001:
                message = uniqueMessage(error)
                break
            default:
                message = 'Something went wrong.'
        }
    } else {
        for (let errorName in error.errors) {
            if (error.errors[errorName].message)
                message = error.errors[errorName].message
        }
    }
 
    return message
}