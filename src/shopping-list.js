require('dotenv').config()
const knex = require('knex')
const ShoppingListService = require('./shopping-list-service')

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL
})

// use all the ShoppingListService methods
ShoppingListService.getAllItems(knexInstance)
    .then(items => console.log(items))
    .then(() =>
        ShoppingListService.insertItem(knexInstance, {
            name: 'New name',
            price: 'New price',
            date_added: new Date(),
            category: 'New category'
        })
    )
    .then(newItem => {
        console.log(newItem)
        return ShoppingListService.updateItem(
            knexInstance,
            newItem.id,
            { name: 'Updated name' }
        ).then(() => ShoppingListService.getById(knexInstance, newItem.id))
    })
    .then(item => {
        console.log(item)
        return ShoppingListService.deleteItem(knexInstance, item.id)
    })