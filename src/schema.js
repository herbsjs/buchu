const suma = require("@herbsjs/suma")

const nativeTypes = [Boolean, Number, String, Array, Object, Date, Function]

const errorCodes = {
    invalidType: 'invalidType',
    invalidKey: 'invalidKey',
    notDefined: 'notDefined',
}
class SchemaValidator {

    static isValid(key, value) {
        const isArrayWithType = this.isArrayWithType(value)
        if (isArrayWithType) value = value[0]
        if (!this.isNativeType(value) && !this.isBaseEntity(value))
            return { [key]: [{ [errorCodes.invalidType]: isArrayWithType ? [value] : value }] }
    }

    static isArrayWithType(value) {
        return Array.isArray(value) && value.length == 1
    }

    static isNativeType(value) {
        return nativeTypes.includes(value)
    }

    static isBaseEntity(value) {
        try{
            const { BaseEntity } = require('@herbsjs/gotu/src/baseEntity')
            return value.prototype instanceof BaseEntity
        }catch{
            return false
        }
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

        return this.validateValues(value)
    }

    validateValues(value) {

        // check if all keys exist on schema description
        for (let key in value) {
            if (value.hasOwnProperty(key) && !this._description.hasOwnProperty(key))
                this._errors.push({ [key]: [{ [errorCodes.invalidKey]: true }] })
        }

        for (let key in this._description) {
            if (this._description.hasOwnProperty(key)) {
                const validation = { type: this._description[key] }
                let ret = suma.validate(value[key], validation)
                if (ret.errors.length > 0)
                    this._errors.push({ [key]: ret.errors })
            }
        }
        return this.isValid
    }

    validateSchema() {
        if (this._description === undefined) {
            this._errors.push({ [errorCodes.notDefined]: true })
            return false
        }

        Object.keys(this._description).forEach(key => {
            let error = SchemaValidator.isValid(key, this._description[key])
            if (error) this._errors.push(error)
        })

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
