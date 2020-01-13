const validator = require("validator"); 
const validText = require("./valid-text")

module.exports = function(data) {
    let errors = {}; 
    data.email = validText(data.email) ? data.email : ''; 
    data.password = validText(data.password) ? data.password : ''; 

    if (!validator.isEmail(data.email)) {
        errors.email = "Email is invalid"
    }
    
    if (validator.isEmpty(data.email)) {
        errors.email = "Email field is required"
    }

    if (validator.isEmpty(data.password)) {
        errors.password = "Email field is required"
    }
    
}

return {
    errors,
    isValid: Object.keys(errors).length === 0 
}

