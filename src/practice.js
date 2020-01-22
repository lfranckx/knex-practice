require('dotenv').config()
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

function searchByProduceName(searchTerm) {
    knexInstance
        .select('product_id', 'name', 'price', 'category')
        .from('amazong_products')
        .where('name', 'ILIKE', `%${searchTerm}%`)
        .then(result => {
            console.log(result)
        })
}

function paginateProducts(page) {
    // If we want page 4, to find the offset: 
    // we'd minus one from the page number (3), 
    // multiply this number by the limit, 10, giving us 30.
    const productsPerPage = 10
    const offset = productsPerPage * (page - 1)
    knexInstance
        .select('product_id', 'name', 'price', 'category')
        .from('amazong_products')
        .limit(productsPerPage) // number of items to display per page
        .offset(offset) // starting position in the list to count up to the limit from
        .then(result => {
        console.log(result)
        })
}

function getProductsWithImages() {
    knexInstance
        .select('product_id', 'name', 'price', 'category', 'image')
        .from('amazong_products')
        .whereNotNull('image')
        .then(result => {
        console.log(result)
        })
}

function mostPopularVideosForDays(days) {
    knexInstance
        .select('video_name', 'region')
        .count('date_viewed AS views')
        .where(
            'date_viewed',
            '>',
            knexInstance.raw(`now() - '?? days'::INTERVAL`, days)
        )
        .from('whopipe_video_views')
        .groupBy('video_name', 'region')
        .orderBy([
        { column: 'region', order: 'ASC' },
        { column: 'views', order: 'DESC' },
        ])
        .then(result => {
            console.log(result)
        })
}
  

searchByProduceName('holo')
paginateProducts(2)
getProductsWithImages()
mostPopularVideosForDays(30)
  
