const { Ok, Err } = require('../../../src/grounds');

class ItemRepository {

	constructor() {
	}

	async findAll(where) {
		return [
			{ id: 10, name: "Do not forget this", position: 1 },
			{ id: 20, name: "Do not forget that", position: 2 }]
	}

	async firstLike() { return null }

	async save() { return Ok() }
}

module.exports.ItemRepository = ItemRepository;