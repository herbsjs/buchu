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
			return "Ok: " + this.value.toString()
		else
			return "Ok"
	}
}

class Err {

	constructor(error) {
		this.error = error;
	}

	get isOk() { return false }
	get isErr() { return true }
	get ok() { return null }
	get err() { return this.error }
	toString() {
		if (this.error)
			return "Error: " + this.error.toString()
		else
			return "Error"
	}
}

module.exports = {
	Ok: (value) => new Ok(value),
	Err: (err) => new Err(err)
};