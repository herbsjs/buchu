class Ok {

	constructor(value) {
		this.value = value
		if (value instanceof Ok)
			this.value = value.value
	}

	get isOk() { return true }
	get isErr() { return false }
	get ok() { return this.value }
	get err() { return null }
	
	toString() {
		if (this.value)
			return 'Ok: ' + JSON.stringify(this.value)
		return 'Ok'
	}

	toJSON() { return { 'Ok': (this.value === undefined ? '' : this.value) } }
}

class Err {

	constructor(error) {
		this._error = error
		if (error instanceof Err)
			this._error = error._error
	}

	get isOk() { return false }
	get isErr() { return true }
	get ok() { return null }
	get err() { return this._error }

	toString() {
		if (this._error)
			return "Error: " + JSON.stringify(this._error)
		return "Error"
	}

	toJSON() {
		let error = (this._error === undefined ? '' : this._error)
		error = error instanceof Error ? error.toString() : error
		return { 'Error': error }
	}

	static _notFound ({ message = 'Not Found', payload, stackTrace } = {}){ 
		return _buildErr('NOT_FOUND', message, payload, stackTrace, 'NotFound', 'notFound')
	}
	
	static _alreadyExists ({ message = 'Entity already exists', payload, stackTrace } = {}) { 
		return _buildErr('ALREADY_EXISTS', message, payload, stackTrace, 'AlreadyExists')
	}
	
	static _invalidEntity ({ message = 'Invalid entity', payload, stackTrace } = {}) { 
		return _buildErr('INVALID_ENTITY', message, payload, stackTrace, 'InvalidEntity')
	}
	
	static _invalidArguments ({ message = 'Invalid arguments', payload, stackTrace } = {}) { 
		return _buildErr('INVALID_ARGUMENTS', message, payload, stackTrace, 'InvalidArguments')
	}
	
	static _permissionDenied ({ message = 'Permission denied', payload, stackTrace } = {}) { 
		return _buildErr('PERMISSION_DENIED', message, payload, stackTrace, 'PermissionDenied')
	}
	
	static _unknown ({ message = 'Unknown Error', payload, stackTrace } = {}) { 
		return _buildErr('UNKNOWN', message, payload, stackTrace, 'Unknown')
	}
	
	static _unimplemented ({ message = 'Unimplemented', payload, stackTrace } = {}) { 
		return _buildErr('UNIMPLEMENTED', message, payload, stackTrace, 'Unimplemented')
	}
}

function _buildErr(code, message, payload, stackTrace, caller) {
	const err = new Err({ payload, stackTrace, code, message })
	err[`is${caller}Error`] = true
	return err
}

const _exports = {
	Ok: (value) => new Ok(value),
	Err: (err) => new Err(err),
}

_exports.Err.notFound = Err._notFound
_exports.Err.alreadyExists = Err._alreadyExists
_exports.Err.invalidEntity  = Err._invalidEntity
_exports.Err.invalidArguments = Err._invalidArguments
_exports.Err.permissionDenied= Err._permissionDenied
_exports.Err.unknown = Err._unknown
_exports.Err.unimplemented = Err._unimplemented

module.exports = _exports