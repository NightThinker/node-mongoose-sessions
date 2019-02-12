const mongodb = require('mongodb')
const getDb = require('../util/database').getDb

const ObjectId = mongodb.ObjectId

class User {
  constructor(name, email, cart, id) {
    this.name = name
    this.email = email
    this.cart = cart //{items: []}
    this._id = id
  }
  
  save() {
    const db = getDb()
    return db
      .collection('users')
      .insertOne(this)
      .then(user => {
        console.log('Add User')
        return user
      })
      .catch(err => console.log(err))

  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
      return cp.productId.toString() === product._id.toString()
    })
    let newQuantity = 1
    const updatedCartItem = [...this.cart.items]
    if(cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1
      updatedCartItem[cartProductIndex].quantity = newQuantity
    } else {
      updatedCartItem.push({
        productId: new ObjectId(product._id),
        quantity: newQuantity
      })
    }
    const db = getDb()
    const updatedCart = {
      items: updatedCartItem
    }
    return db
      .collection('users')
      .updateOne(
        {_id: new ObjectId(this._id)}, 
        { $set: { cart: updatedCart }}
      )
  }

  static findById(userId) {
    const db = getDb()
    return db.collection('users')
      .findOne({ _id: new ObjectId(userId) })
  }
}

module.exports = User