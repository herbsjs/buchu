const { Ok, Err, usecase, step } = require('../../../src/buchu')
const dependency = {
    ItemRepository: require('../repositories/ItemRepository').ItemRepository,
    Item: require('../entities/Item').Item
}

const listItems = (injection) =>

    usecase("List all items on a expecific to-do list", {

        request: { listId: Number },

        authorize: async (user) => user.isAdmin ? Ok() : Err(),

        setup: (ctx) => ctx.di = Object.assign({}, dependency, injection),

        "List items": step(async (ctx) => {
            const itemRepo = new ctx.di.ItemRepository(ctx.di)
			ctx.ret.items = await itemRepo.findAll({listId: ctx.req.listId})
			return Ok()
        })
    })

module.exports = { listItems }