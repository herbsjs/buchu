class Ok {

	constructor(value) {
		this.value = value;
	}

	get isOk() { return true }
	get isErr() { return false }
	get ok() { return this.value }
	get err() { return null }
	toString() {
		if (this.value)
			return 'Ok: ' + JSON.stringify(this.value)
		else
			return 'Ok'
	}
	toJSON() { return { 'Ok': this.value } }
}

class Err {

	constructor(error) {
		this._error = error;
	}

	get isOk() { return false }
	get isErr() { return true }
	get ok() { return null }
	get err() { return this._error }
	toString() {
		if (this._error)
			return "Error: " + this._error.toString()
		else
			return "Error"
	}
	toJSON() { return this.toString() }
}

module.exports = {
	Ok: (value) => new Ok(value),
	Err: (err) => new Err(err)
};
