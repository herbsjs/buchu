const { Ok, Err } = require('../../../src/buchu')

class Item {

	constructor(item) {
		this.id = item.id
		this.name = item.name
		this.position = item.position
	}

	validate() { return Ok()}

	static build(obj) {
		const newItem = new this()
		// TODO: Validate values
		return Object.assign(newItem, obj)
	}
}

module.exports.Item = Item