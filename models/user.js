const mongodb =require('mongodb');
const getDb = require('../util/database').getDb;

class User {
    constructor(username, email, cart, id) {
        this.username = username;
        this.email = email;
        this.cart = cart;
        this._id = id ? new mongodb.ObjectId(id) : null;
    }
    save() {
        const db = getDb();
        return db.collection('users').insertOne(this);
    }
    addToCart(product)
    {
        const db = getDb();
        this.cart = this.cart ? this.cart : {items: []};
        const updatedCartItems = [...this.cart.items];
        const cartProductIndex = this.cart.items.findIndex(
            cartProduct =>{
                return cartProduct.productID.toString() === product._id.toString();
            }
        );
        if(cartProductIndex >= 0)
        {
            //Product Exists in Cart
            updatedCartItems[cartProductIndex].quantity += 1;
        }else
        {
            //Product Does Not Exist in Cart
            updatedCartItems.push({productID: new mongodb.ObjectId(product._id), quantity: 1});
        }
        const updatedCart = {items: updatedCartItems};
        
        return db.collection('users').updateOne({_id: new mongodb.ObjectId(this._id)},{$set: {cart: updatedCart}});
    }
    static findById(userID) {
        const db = getDb();
        return db.collection('users').findOne({_id: new  mongodb.ObjectId(userID)});
    }
}
module.exports = User;