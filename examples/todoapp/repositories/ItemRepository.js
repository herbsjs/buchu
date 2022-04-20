const { Ok, Err } = require('../../../src/buchu')

class ItemRepository {

	constructor() {
		this._list = [
			{ id: 10, name: "Do not forget this", position: 1 },
			{ id: 20, name: "Do not forget that", position: 2 }
		]

	}


	async findAll(where) {
		return this._list
	}

	async firstLike() { return null }

	async findOne(id) { return this._list.find(item => item.id = id)}

	async save() { return Ok() }

	async delete() { return 'Deleted' }

}

module.exports.ItemRepository = ItemRepository