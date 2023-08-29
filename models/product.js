const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;
class Product {
  constructor(title, description, price, imageUrl) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.imageUrl = imageUrl;
  }
  save() {
    const db = getDb();
    return db.collection('products').insertOne(this);
  }
  static fetchAll() {
    const db = getDb();
    return db.collection('products').find().toArray();
  }
  static fetchOne(productID) {
    const db = getDb();
    return db.collection('products').findOne(
      {
        _id: new mongodb.ObjectId(productID),
      }
    );
  }
}


module.exports = Product;