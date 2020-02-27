<p align="center"><img src="https://raw.githubusercontent.com/herbsjs/buchu/master/docs/logo.png" height="220"></p>

# buchu
Uniform, auditable and secure use case javascript library. Influenced by Clean Architecture and Trailblazer

### Installing
    $ npm install buchu

### Using

Check the complete examples [here](https://github.com/dalssoft/buchu/tree/master/examples). 

usecases/addOrUpdateItem.js:
```javascript
const { Ok, Err, usecase, step, ifElse } = require('../../../src/buchu')
const dependency = {
    ItemRepository: require('../repositories/ItemRepository').ItemRepository,
    ...
}

const addOrUpdateItem = (injection) =>

    usecase('Add or Update an Item on a to-do List', {

        // Input/Request type validation 
        request: { listId: Number, item: Object },

        // Authorization Audit  
        authorize: (user) => user.isAdmin ? Ok() : Err(),

        // Dependency Injection control
        setup: (ctx) => ctx.di = Object.assign({}, dependency, injection),
        
        // Step audit and description
        'Check if the Item is valid': step((ctx) => {
            ...
            return item.validate() // Ok or Error
        }),

        'Check if the List exists': step(async (ctx) => {
            ...
            return Ok()
        }),

        // Conditional step
        'Add or Update the Item': ifElse({

            'If the Item exists': step(async (ctx) => {
                ...
                return Ok(newItem)
            }),

            'Then: Add a new Item to the List': step(async (ctx) => {
                ...
                return ctx.ret = await itemRepo.save(item) // Ok or Error
            }),

            'Else: Update Item on the List': step(async (ctx) => {
                ...
                return ctx.ret = await itemRepo.save(item) // Ok or Error
            })
        })
    })
```

controler/addOrUpdateItem.js:
```javascript
app.put('/items/:item', function (req, res) {
    const request = req.params
    const user = { name: 'John', id: '923b8b9a', isAdmin: true } // from session

    const uc = addOrUpdateItem()
    uc.authorize(user)
    const ret = await uc.run(request)
    res.send(ret)
})
```

`uc.doc()`:
```javascript
{
  type: 'use case',
  description: 'Add or Update an Item on a to-do List',
  request: { listId: Number, item: Object },
  steps: [
    { type: 'step', description: 'Check if the Item is valid', steps: null },
    { type: 'step', description: 'Check if the List exists', steps: null },
    { 
        type: 'if else',
        if: { type: 'step', description: 'If the Item exists', steps: null },
        then: { type: 'step', description: 'Then: Add a new Item to the List', steps: null },
        else: { type: 'step', description: 'Else: Update Item on the List', steps: null }
    }
  ]
}
```

`uc.auditTrail`:
```javascript
{
    type: 'use case',
    description: 'Add or Update an Item on a to-do List',
    transactionId: '9985fb70-f56d-466a-b466-e200d1d4848c',
    user: { name: 'John', id: '923b8b9a', isAdmin: true },
    authorized: true,
    return: {
        Ok: { item: { id: 100, name: 'Do not forget this', position: 9 } }
    },
    steps: [
        { type: 'step', description: 'Check if the Item is valid', return: {} },
        { type: 'step', description: 'Check if the List exists', return: {} },
        {
            type: 'if else', 
            description: 'Add or Update the Item',
            returnIf: { Ok: true },
            returnThen: {}
        }
    ]
}
```

### Request Validation

A request can be validated against the field's type.

```javascript
const addOrUpdateItem = (injection) =>

    usecase('Add or Update an Item on a to-do List', {

        // Input/Request type validation 
        request: { listId: Number, item: Object },

    ...
```

#### Request types

A field in a request can be of basic types, the same as those used by JavaScript:

`Number`: double-precision 64-bit binary format IEEE 754 value

`String`: a UTF‐16 character sequence

`Boolean`: true or false

`Date`: represents a single moment in time in a platform-independent format. 

`Object`: the Object class represents one of JavaScript's data types.

`Array`: the Array class is a object that is used in the construction of arrays. 


### Motivations

#### Maintainability 
"Programs must be written for people to read, and only incidentally for machines to execute" - Harold Abelson, Structure and Interpretation of Computer Programs 

Understanding what a software is doing from a business perspective is a must in order to be able to change it quickly and in a sustainable way. 

#### Metadata for system intent 
It should be easy to retrieve a system's metadata for all its use cases and steps. This info could be used to leverage innovative interfaces (ex: dynamic admin pages, use case documentations, etc), helping narrow the gap between developers, testers and product managers.

#### Auditable and Secure
It should be easy to have enterprise grade features even for simple applications. Authorization and auditing, for instance, should be available out of the box. Not using should be opt-in.

### Use Case

#### What is it?

A Use Case reflects a single action exposed by the Domain to the end user. Ex: _Reopen Ticket_, _Reply Message_, _Add User_

Internaly a Use Case control the interaction between Entities, Repositories (infrastructure) and other Domain components.

It should:
- Be modeled around business
- Be reusable
- Be testable / Have clear acceptance criteria
- Help identify right architecture 
- Ubiquitous language

"Use cases orchestrate the flow of data to and from the entities, and direct those entities to use their Critical Business Rules to achieve the goals of the use case." - Clean Architecture book

#### Best pratices

- Keep it simple by telling stories
- Understand the big picture
- Focus on value
- Build the use case in steps 

Architecture:

- Implement business __flows__ using Use Cases. 

	Ex: _Reply Message_ use case interacts with `Message`, `Ticket`, `User` and others entities in order to reply a message for a user 

- Split the __flows__ in smaller steps

- Avoid implement __validations__ using Use Cases. Prefer Entities for validations
	
- Access Use Cases from outside the Domain

	Use cases are the "entry points" for the Domain layer, so it is the only accessible layer from outside the Domain.

- Don't access any other sublayer which belongs to Domain layer (Entities, etc) apart Use Case from outside Domain

- Name the Use Case folder, file and its steps  as an action (verb). 

	Ex: `OpenTicket.js`, `ReplyMessage.js`, `AddUser.js`

	Use Cases are implemented as [command patterns](https://sourcemaking.com/design_patterns/command).

References:
- Clean Architecture book [link](https://www.amazon.com/Clean-Architecture-Craftsmans-Software-Structure/dp/0134494164)
- Use Case 2.0 [link](https://www.ivarjacobson.com/sites/default/files/field_iji_file/article/use-case_2.0_final_rev3.pdf)
- Use Case diagram [link](http://www.agilemodeling.com/artifacts/useCaseDiagram.htm)
- Service Layer [link](https://martinfowler.com/eaaCatalog/serviceLayer.html)

### To Do
- [X] Base - Run a use case
- [X] Use Case Error - Ok or Error results for a use case (Rust inspired) 
- [X] Steps - Enable multiple steps for a use case
- [X] Nested Steps - Enable multiple steps for a parent step
- [ ] Nested Steps - multiple files - Enable multiple steps in diferent files for a parent step
- [ ] Use usecase as a step
- [X] Doc Step - Get description and structure from use case and its steps 
- [X] Request - Be able to describe and validate the use case request object 
- [ ] Response - Be able to describe and validate the use case response object 
- [X] Dependency Injection (removed)
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

### Contribute
Come with us to make an awesome *Buchu*.

Now, if you do not have technical knowledge and also have intend to help us, do not feel shy, [click here](https://github.com/dalssoft/buchu/issues) to open an issue and collaborate their ideas, the contribution may be a criticism or a compliment (why not?)

We have some conventions to contribute to the *Buchu* project, see more information in our [CONTRIBUTING.md](CONTRIBUTING.md). So please, read this before send to us a [pull requests](https://github.com/dalssoft/buchu/pulls).

### The Herb

Buchu is most often used as a stimulating tonic and a diuretic. It is now commonly used to treat urinary tract infections. In the past, this herb has also been used to treat arthritis, kidney stones and gout. It can also be used externally for bruises and sprains.

https://www.herbslist.net/

https://en.wikipedia.org/wiki/Agathosma_betulina

### License

**Buchu** is released under the
[MIT license](https://github.com/dalssoft/buchu/blob/development/LICENSE.md).