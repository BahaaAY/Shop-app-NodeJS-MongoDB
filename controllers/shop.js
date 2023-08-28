const calculateTotal = require('../util/functions').calculateTotal;

const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.findAll().then(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  }).catch(err => console.log("Error Fetch All:", err));
};

exports.getProduct = (req, res, next) => {
  const productID = req.params.productID;
  Product.findByPk(productID).then(product => {
    res.render('shop/product-detail', {
      pageTitle: product.title,
      path: '/products',
      product: product,
    });
  });
};

exports.getIndex = (req, res, next) => {
  Product.findAll().then(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  }).catch(err => console.log("Error Fetch All:", err));
};

exports.getCart = (req, res, next) => {
  req.user.getCart().then(cart => {
    console.log("UserCart: ", cart);
    return cart.getProducts().then(cartProducts => {
      const total = calculateTotal(cartProducts);
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        cartProducts: cartProducts,
        cartTotal: total,

      });

    }).catch(err => {
      console.log("Error Getting Cart Products! ", err);
    });

  }).catch(err => {
    console.log("Error Getting Cart!: ", err);
  });

};
exports.addToCart = (req, res, next) => {
  console.log('Product Added: ', req.body.productID);
  var productID = req.body.productID;
  let fetchedCart;
  var newQuantity = 1;
  req.user.getCart().then(cart => {
    fetchedCart = cart;
    //check if product already exists?
    return cart.getProducts({ where: { id: productID } });
  }).then(products => {
    if (products.length > 0) //product exists in cart
    {
      // Increase existing product quantity
      newQuantity = products[0].cartItem.quantity + 1;

    }

    return Product.findByPk(productID); // Get Product


  }).then((product) => {
    // check if product is a valid product
    if (product) {
      return fetchedCart.addProduct(product, { through: { quantity: newQuantity } });
    }
  }).then(() => {
    res.redirect('/cart');
  }).catch(err => {
    console.log("Error Getting Cart!: ", err);
  });
};

exports.deleteCartItem = (req, res, next) => {

  const productID = req.body.productID;
  req.user.getCart().then(cart => {
    return cart.getProducts({ where: { id: productID } });  
  }

  ).then(products => {
    if (products.length > 0) { // Check if Product Exists in Cart
      return products[0].cartItem.destroy();  // Delete Cart Item
    } else {
      console.log("Product Not Found!");
      Promise.resolve();  
    }
  }).then(() => {
    res.redirect('/cart');
  }).catch(err => { console.log("Error: ", err); });
};

exports.getOrders = (req, res, next) => {
  req.user.getOrders({ include: ['products']}).then(orders => {
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders,
    });
  }).catch(err => { console.log("Error: ", err); });

  
};

exports.postOrder = (req, res, next) => { 
  let user = req.user;  // Get User
  let fetchedCart;  
  let cartProducts;
  user.getCart().then(  // Get User Cart
    cart => {
      fetchedCart = cart;
      return fetchedCart.getProducts(); // Get Cart Products
    }
  ).then(
    products => {
      cartProducts = products; 
      return user.createOrder({ total: calculateTotal(products) }); // Create Order
    }
  ).then(
    order => {

      return order.addProducts(cartProducts.map(product => {  // Add Products to Order
        product.orderItem = { quantity: product.cartItem.quantity };  // Add Quantity to OrderItem
        return product;
      }));
    }

  ).then(() => {
    return fetchedCart.setProducts(null); // Empty Cart
  }).then(()=>{ 
    console.log("Order Created!"); 
    res.redirect('/orders');  // Redirect to Orders Page
  }).catch(err => { console.log("Error: ", err); });  
}

exports.getCheckout = (req, res, next) => { 
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
