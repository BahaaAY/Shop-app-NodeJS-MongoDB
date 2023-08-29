const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;
class Product {
  constructor(_id, title, description, price, imageUrl) {
    this._id = _id;
    this.title = title;
    this.description = description;
    this.price = price;
    this.imageUrl = imageUrl;
  }
  save() {
    const db = getDb();
    if(this._id)
    {
      console.log("Updating Product: ", this._id);
      //Update Existing Product
      return db.collection('products').updateOne({_id: new mongodb.ObjectId(this._id)},{$set: {title: this.title, description: this.description, price: this.price, imageUrl: this.imageUrl}});
    }else{
      //Add New Product
      return db.collection('products').insertOne(this);
    }
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
  static deleteOne(productID) {
    const db = getDb();
    return db.collection('products').deleteOne(
      {
        _id: new mongodb.ObjectId(productID),
      }
    );
  }
}


module.exports = Product;