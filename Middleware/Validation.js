const Joi = require("joi")


function Validation(rules, body) {
    const schema = Joi.object(rules)
    return schema.validate(body)
}

module.exports = Validation