const db = require('../../data/dbConfig')

function findBy(filter) {
    return db('users').select('*').where(filter)
}

function findById(id) {
    return db('users').select('*').where(id).first()
}
  

async function add(user) {
    const id = await db('users').insert(user)
    return findById({id: id})

}

module.exports = {
    add, 
    findBy,
    findById
}