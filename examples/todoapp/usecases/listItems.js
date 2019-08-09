const { Ok, Err, usecase, step } = require('../../../src/grounds')

const listItems = () =>

    usecase("List all items on a expecific to-do list", {

        request: { listId: Number },

        authorize: (user) => user.isAdmin ? Ok() : Err(),

        dependency: {
            ItemRepository: require('../repositories/ItemRepository').ItemRepository,
            Item: require('../entities/Item').Item
        },

        "List items": step(async (ctx) => {
            const itemRepo = new ctx.di.ItemRepository(ctx.di)
			ctx.ret.items = await itemRepo.findAll({listId: ctx.req.listId})
			return Ok()
        })
    })

module.exports = { listItems }