# grounds
Uniform, auditable and secure use case javascript library. Influenced by Clean Architecture and Trailblazer

### Installing
    $ npm install grounds

### Using

```javascript
const { Ok, Err, usecase, step, ifElse } = require('../../../src/grounds')

const addOrUpdateItem = () =>

    usecase("Add or Update an Item on a to-do List", {

        request: { listId: Number, item: Object },

        authorize: (user) => user.isAdmin ? Ok() : Err(),
        
        dependency: {
            ItemRepository: require('../repositories/ItemRepository').ItemRepository,
            ListRepository: require('../repositories/ListRepository').ListRepository,
            Item: require('../entities/Item').Item
        },

        "Check if the Item is valid": step((ctx) => {
            const item = ctx.ret.item = new ctx.di.Item(ctx.req.item)
            return item.validate() // Ok or Error
        }),

        "Check if the List exists": step(async (ctx) => {
            const listRepo = new ctx.di.ListRepository(ctx.di)
            const list = await listRepo.first(ctx.req.listId)
            const hasList = (list != null)
            if (!hasList) { return Err("List does not exist. listId: " + ctx.req.listId) }
            return Ok()
        }),

        "Add or Update the Item": ifElse({

            "If the Item exists": step(async (ctx) => {
                const itemRepo = new ctx.di.ItemRepository(ctx.di)
                const item = await itemRepo.firstLike(ctx.req.item.name)
                const newItem = (item == null)
                if (!newItem) ctx.ret.item = item
                return Ok(newItem)
            }),

            "Then: Add a new Item to the List": step(async (ctx) => {
                const item = ctx.ret.item = new ctx.di.Item(ctx.req.item)
                const itemRepo = new ctx.di.ItemRepository(ctx.di)
                return await itemRepo.save(item) // Ok or Error
            }),

            "Else: Update Item on the List": step(async (ctx) => {
                const item = ctx.ret.item
                item.name = ctx.req.item.name
                item.position = ctx.req.item.position
                const itemRepo = new ctx.di.ItemRepository(ctx.di)
                return await itemRepo.save(item) // Ok or Error
            })
        })
    })
```

### To Do
- [X] Base - Run a use case
- [X] Use Case Error - Ok or Error results for a use case (Rust inspired) 
- [X] Steps - Enable multiple steps for a use case
- [X] Nested Steps - Enable multiple steps for a parent step
- [ ] Nested Steps - multiple files - Enable multiple steps in diferent files for a parent step
- [X] Doc Step - Get description and structure from use case and its steps 
- [X] Request - Be able to describe and validate the use case request object 
- [ ] Response - Be able to describe and validate the use case response object 
- [X] Dependency Injection
- [X] `ctx` var - Share context between Steps 
- [X] Conditional Steps - Enable a If/Else constructor for steps
- [X] Authorization - Be able to authorize the execution of a use case and its steps
- [X] Audit - Be able to track use case runtime information 
- [ ] Audit - Timing - Be able to track use case and its steps execution time 
- [ ] Async / MQ - Multiple Rounds - Be able to partially execute a use case and continue (when a MQ is necessary, for instance) 
- [X] transaction ID - A ID to track execution between steps
- [ ] session ID - A ID to track execution between use cases
- [X] Deal with exceptions
- [ ] Deal with no default results (Ok/Err)
- [X] Deal with async / await steps
- [X] Use case examples
- [ ] Doc - Documentation and samples for each feature 


## Contribute
Come with us to make an awesome *Grounds*.

Now, if you do not have technical knowledge and also have intend to help us, do not feel shy, [click here](https://github.com/dalssoft/grounds/issues) to open an issue and collaborate their ideas, the contribution may be a criticism or a compliment (why not?)

We have some conventions to contribute to the *Grounds* project, see more information in our [CONTRIBUTING.md](CONTRIBUTING.md). So please, read this before send to us a [pull requests](https://github.com/dalssoft/grounds/pulls).

### License

**Grounds** is released under the
[MIT license](https://github.com/dalssoft/grounds/blob/development/LICENSE.md).