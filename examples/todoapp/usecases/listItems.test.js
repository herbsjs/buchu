const { listItems } = require('./listItems')
const { Ok, Err } = require('../../../src/grounds')
const assert = require('assert')

describe('List Items Use Case', () => {

    it('Should Return Items ', async () => {

        // Given
        const itemList = [
            { id: 99, name: "Item 1", position: 9 },
            { id: 88, name: "Item 2", position: 11 }]
        const injection = {
            ItemRepository: class {
                findAll(where) { return itemList }
            }
        }
        const req = { listId: 1 }
        const user = { user: "John", id: '923b8b9a', isAdmin: true }

        // When
        const uc = listItems()
        uc.authorize(user)
        uc.inject(injection)
        const ret = await uc.run(req)

        // Then
        assert.ok(ret.isOk)
        assert.deepEqual(ret.value.items, itemList)
    })
})