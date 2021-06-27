/* eslint-disable no-console */
const { addOrUpdateItem } = require('./usecases/addOrUpdateItem')

void async function main() {
    const user = { user: "John", id: '923b8b9a', isAdmin: true }

    const req = {
        listId: 1,
        item: { id: 10, name: "Do not forget this", position: 9 }
    }

    const uc = addOrUpdateItem()
    console.log("------ doc: ------\n", uc.doc())

    await uc.authorize(user)
    await uc.run(req)
    console.log("------ audit: ------\n", uc.auditTrail)

}()