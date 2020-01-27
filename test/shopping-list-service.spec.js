const ShoppingListService = require('../src/shopping-list-service')
const knex = require('knex')

describe(`shopping_list service object`, function() {
    let db
    let testItems = [
        {
            id: 1,
            name: 'Hamburger',
            price:  '5.99',
            date_added: new Date('2029-01-22T16:28:32.615Z'),
            category: 'Main'
        },
        {
            id: 2,
            name: 'Chips',
            price:  '1.89',
            date_added: new Date('2100-05-22T16:28:32.615Z'),
            category: 'Snack'
        },
        {
            id: 3,
            name: 'Caesar Salad',
            price:  '8.99',
            date_added: new Date('1919-12-22T16:28:32.615Z'),
            category: 'Lunch'
        },
        {
            id: 4,
            name: 'Eggs',
            price:  '3.40',
            date_added: new Date('1919-12-22T16:28:32.615Z'),
            category: 'Breakfast'
        }
    ]

    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL
        })
    })

    before(() => db('shopping_list').truncate())

    afterEach(() => db('shopping_list').truncate())

    after(() => db.destroy())

    context(`Given shopping_list has data`, () => {
        beforeEach(() => {
            return db  
                .into('shopping_list')
                .insert(testItems)
        })

        it(`getAllItems() resolves all items in 'shopping_list' table`, () => {
            const expectedItems = testItems.map(item => ({
                ...item,
                checked: false
            }))
            return ShoppingListService.getAllItems(db)
                .then(actual => {
                    expect(actual).to.eql(expectedItems)
                })
        })

        it(`getById() resolves an item by id from 'shopping_list' table`, () => {
            const thirdId = 3
            const thirdTestItem = testItems[thirdId - 1]
            return ShoppingListService.getById(db, thirdId)
                .then(actual => {
                    expect(actual).to.eql({
                        id: thirdId,
                        name: thirdTestItem.name,
                        price: thirdTestItem.price,
                        date_added: thirdTestItem.date_added,
                        category: thirdTestItem.category,
                        checked: false
                    })
                })
        })

        it(`deleteItem() removes an item by id from the 'shopping_list' table`, () => {
            const itemId = 3
            return ShoppingListService.deleteItem(db, itemId)
                .then(() => ShoppingListService.getAllItems(db))
                .then(allItems => {
                    const expected = testItems.filter(item => item.id !== itemId)
                    expect(allItems).to.eql(expected)
                })
        })

        it(`updateItem() updates an item from 'shopping_list' table`, () => {
            const idOfItemToUpdate = 3
            const newItemData = {
                name: 'updated name',
                price: 'updated price',
                date_added: new Date(),
                checked: true
            }
            const originalItem = testItems[idOfItemToUpdate - 1]
            return ShoppingListService.updateItem(db, idOfItemToUpdate, newItemData)
                .then(() => ShoppingListService.getById(db, idOfItemToUpdate))
                .then(item => {
                    expect(item).to.eql({
                        id: idOfItemToUpdate,
                        ...originalItem,
                        ...newItemData
                    })
                })
        })
    })

    context(`Given 'shopping_list' has no data`, () => {
        it(`getAllItems() resolves an empty array`, () => {
            return ShoppingListService.getAllItems(db)
                .then(actual => {
                    expect(actual).to.eql([])
                })
        })

        it(`insertItem() inserts a new item and resolves the new item with an 'id'`, () => {
            const newItem = {
                name: 'Test new item name',
                price: 'Test new price',
                date_added: new Date('2020-01-01T00:00:00.000Z'),
                checked: true,
                category: 'Lunch'
            }
            return ShoppingListService.insertItem(db, newItem)
                .then(actual => {
                    expect(actual).to.eql({
                        id: 1,
                        name: newItem.name,
                        price: newItem.price,
                        date_added: new Date(newItem.date_added),
                        checked: newItem.checked,
                        category: newItem.category
                    })
                })
        })
    })
})