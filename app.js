const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');


const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findByPk(1).then(
        user => {
            req.user = user;
            next();
        }
    ).catch(err => { console.log(err) });
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

User.hasMany(Product, { constraints: true, onDelete: 'CASCADE' });

User.hasOne(Cart, { constraints: true, onDelete: 'CASCADE' });      // One to One Relationship between User and Cart
Cart.belongsTo(User, { constraints: true, onDelete: 'CASCADE' })        // One to One Relationship between User and Cart

Product.belongsToMany(Cart, { through: CartItem }); // Many to Many Relationship between Products and Carts
Cart.belongsToMany(Product, { through: CartItem }); // Many to Many Relationship between Carts and Products

Order.belongsToMany(Product, { through: OrderItem }); // Many to Many Relationship between Orders and Products
User.hasMany(Order); // One to Many Relationship between User and Orders

let fetchedUser;
sequelize.sync(
    {force: true}
).then(result => {
    //console.log(result);
    return User.findByPk(1);
}).then(user => {
    if (!user) {
        console.log("User Created!");
        return User.create({ name: 'Bahaa', email: 'bahaa@test.com' });
    }
    console.log("User Already Exists!");
    return Promise.resolve(user);
}).then(user => {
    fetchedUser = user;
    return fetchedUser.getCart();

}).then(cart => {
    if (!cart) {
        console.log("Cart Created");
        return fetchedUser.createCart();
    }

}).then(() => {
    app.listen(3000);
}).catch(err => console.log(err));
