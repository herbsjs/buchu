const { Ok, Err, usecase, step, ifElse } = require('../../../src/buchu')
const dependency = {
    ItemRepository: require('../repositories/ItemRepository').ItemRepository,
    ListRepository: require('../repositories/ListRepository').ListRepository,
    Item: require('../entities/Item').Item
}

const deleteItem = (injection) =>

    usecase("Delete a item from a to-do List", {

        request: { listId: Number, itemId: Number },

        authorize: (user) => user.isAdmin ? Ok() : Err(),

        setup: (ctx) => ctx.di = Object.assign({}, dependency, injection),

        "Check if the List exists": step(async (ctx) => {
            const listRepo = new ctx.di.ListRepository(ctx.di)
            const list = await listRepo.first(ctx.req.listId)
            const hasList = (list != null)
            if (!hasList) { return Err("List does not exist. listId: " + ctx.req.listId) }
            return Ok()
        }),

        "Check if the Item exists": step(async (ctx) => {
            const itemRepo = new ctx.di.ItemRepository(ctx.di)
            const item = await itemRepo.findOne(ctx.req.itemId)
            if (!item){
                ctx.ret.msg = 'Already deleted'
                ctx.stop()
                return Ok()
            }
            return Ok(item)
        }),

        "Delete the Item": step(async (ctx) => {
            const { itemId } = ctx.req
            const itemRepo = new ctx.di.ItemRepository(ctx.di)
            ctx.ret.msg =await itemRepo.delete(itemId) 
            return Ok()
        })
    })

module.exports = { deleteItem }