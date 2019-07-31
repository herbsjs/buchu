
/**
 * influenced by https://github.com/ioncreature/simple-object-schema
 */

const { Ok, Err } = require('./results')

class SchemaValidator {

    static isValid(key, value) {
        if (Array.isArray(value) && value.length == 1)
            return this.isValid(key, value[0])

        if (!this.isStandardType(value))
            return Err({
                type: 'invalid schema',
                key: key,
                value: value,
                msg: `Key ["${key}"] has a invalid value of ["${value}"]. Standard types expected.`
            });
    }

    static isStandardType(value) {
        const STANDARD_TYPES = [Boolean, Number, String, Array, Object, Date, Function];
        return STANDARD_TYPES.indexOf(value) > -1;
    }
}

class ValueValidator {

    static isValid(key, spec, value) {
        if (SchemaValidator.isStandardType(spec))
            return this.validate(key, spec, value)
    }

    static validate(key, spec, value) {

        function buildError(msg) {
            const VALUE_ERROR_TYPE = 'invalid value'
            return Err({
                type: VALUE_ERROR_TYPE,
                key: key,
                value: value,
                //schema: spec,
                msg: msg
            })
        }

        function isObject(obj) {
            const type = typeof obj;
            return type === 'function' || type === 'object' && !!obj;
        }

        if (typeof value === 'undefined') return

        if (spec === Number && typeof value !== 'number')
            return buildError(`["${value}"] is not a number.`)

        if (spec === String && !(typeof value === 'string' || value instanceof String))
            return buildError(`["${value}"] is not a string.`)

        if (spec === Boolean && !(value === false || value === true))
            return buildError(`["${value}"] is not boolean.`)

        if (spec === Date && !(toString.call(value) === '[object Date]'))
            return buildError(`["${value}"] is not a date.`)

        if (spec === Object && !isObject(value))
            return buildError(`["${value}"] is not a object.`)

        if (spec === Array && !Array.isArray(value))
            return buildError(`["${value}"] is not a array.`)

        return
    }
}

class Schema {

    constructor(description) {
        this._description = description
        this._errors = []
    }

    validate(value) {
        const isValidSchema = this.validateSchema()
        if (!isValidSchema) return false

        return this.validateValues(value);
    }

    validateValues(value) {

        // check if all keys exist on schema description
        for (let key in value) {
            if (value.hasOwnProperty(key) && !this._description.hasOwnProperty(key))
                this._errors.push(Err({
                    type: 'invalid value',
                    key: key,
                    //schema: spec,
                    msg: `Key ["${key}"] does not exist on schema.`
                }))
        }

        for (let key in this._description) {
            if (this._description.hasOwnProperty(key)) {
                let error = ValueValidator.isValid(key, this._description[key], value[key]);
                if (error)
                    this._errors.push(error)
            }
        }
        return this.isValid;
    }

    validateSchema() {
        if (this._description === undefined) {
            this._errors.push({
                type: 'invalid schema',
                msg: `Schema was not defined.`
            })
            return false
        }

        Object.keys(this._description).forEach(key => {
            let error = SchemaValidator.isValid(key, this._description[key])
            if (error) this._errors.push(error)
        });

        return this.isValid
    }

    get isValid() {
        return this._errors.length == 0
    }

    get errors() {
        return this._errors
    }

}

const schema = (description) => {
    return new Schema(description)
}

module.exports = { schema }