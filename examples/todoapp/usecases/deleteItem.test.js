const { deleteItem } = require('./deleteItem')
const { Ok } = require('../../../src/buchu')
const assert = require('assert')

describe('Delete a Item Use Case', () => {

    describe('Delete Item', () => {

        it('Should already deleted item', async () => {

            // Given
            const injection = {
                ItemRepository: class {
                    findOne(id) { return null }
                    delete(id) { return 'Deleted'}
                }
            }
            const req = {
                listId: 1,
                itemId: 10
            }
            const user = { user: "John", id: '923b8b9a', isAdmin: true }

            // When
            const uc = deleteItem(injection)
            uc.authorize(user)
            const ret = await uc.run(req)

            // Then
            assert.ok(ret.isOk)
            assert.strictEqual(ret.value.msg, 'Already deleted')
        })



        it('Should delete a item ', async () => {

            // Given
            const injection = {
                ItemRepository: class {
                    findOne(item) { return { id: 12, name: "The north remembers", position: 2 } }
                    delete(id) { return 'Deleted'}
                }
            }
            const req = {
                listId: 1,
                itemId: 12
            }
            const user = { user: "John", id: '923b8b9a', isAdmin: true }

            // When
            const uc = deleteItem(injection)
            uc.authorize(user)
            const ret = await uc.run(req)

            // Then
            assert.ok(ret.isOk)
            assert.strictEqual(ret.value.msg, 'Deleted')
        })
    })
})