const { addOrUpdateItem } = require('./usecases/addOrUpdateItem')

function addOrUpdateItemUC() {
    const user = { user: "John", id: '923b8b9a', isAdmin: true }
    const uc = addOrUpdateItem()
    uc.authorize(user)
    return uc
}
const req = {
    listId: 1,
    item: { id: 10, name: "Do not forget this", position: 9 }
}
const uc = addOrUpdateItemUC()
console.log(JSON.stringify(uc.doc()))
uc.run(req)
console.log(uc.auditTrail)