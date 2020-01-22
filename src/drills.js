require('dotenv').confif()
const knex = require('knex')
const knexInstance = knex({
    client: 'pg',
    connection: {
        host : '127.0.0.1',
        user : 'dunder_mifflin',
        password : '',
        database : 'knex-practice'       
    }
})


// [x] A function that takes one parameter for searchTerm which will be any string.
// [x] The function will query the shopping_list table using Knex methods 
// [x] and select the rows which have a name that contains the searchTerm using a case insensitive match.
function searchByItemName(searchTerm) {
    knexInstance
        .select('item_id', 'item_name', 'price', 'category')
        .from('shopping_list')
        .where('name', 'ILIKE', `%${searchTerm}%`)
        .then(result => {
            console.log(result)
        })
}

searchByItemName('burger')

// [x] A function that takes one parameter for pageNumber which will be 
// a number
// [x] The function will query the shopping_list table using Knex methods 
// and select the pageNumber page of rows paginated to 6 items per page.
function paginateItems(page) {
    const itemsPerPage = 6
    const offset = itemsPerPage * (page-1)
    knexInstance
        .select('item_id', 'item_name', 'price', 'category')
        .from('shopping_list')
        .limit(itemsPerPage)
        .offset(offset)
        .then(result => {
            console.log(result)
        })
}

paginateItems(3)

// [x] A function that takes one parameter for daysAgo which will be a number 
// representing a number of days.
// [x] This function will query the shopping_list table using Knex methods and 
// select the rows which have a date_added that is greater than the daysAgo.
function itemsAddedDaysAgo(daysAgo) {
    knexInstance   
        .select('item_id', 'item_name', 'price', 'date_added', 'category', 'checked')
        .from('shopping_list')
        .where(
            'date_added', 
            '>',
            knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
        )
        .then(result => {
            console.log(result)
        })       
}
itemsAddedDaysAgo(4)

// [x] A function that takes no parameters
// [x] The function will query the shopping_list table using Knex methods and 
// select the rows grouped by their category and showing the total price 
// for each category.
function totalPriceOfCategory() {
    knexInstance
        .select('category')
        .sum('price as total')
        .from('shopping_list')
        .groupBy('category')
        .then(result => {
            console.log(result)
        })
}

totalPriceOfCategory()