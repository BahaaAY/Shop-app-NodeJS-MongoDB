
const Product = require('../models/product');
const Cart = require('../models/cart');


exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  Product.create({
    title: title,
    description: description,
    imageUrl: imageUrl,
    price: price,
  }).then(result=>{
    console.log('Product Created!');
    res.redirect('/admin/products');

  }).catch(err=>{
    console.log("Error Creating Proudct: ", err);
  });

  
};

exports.getEditProduct = (req, res, next) => {
  const productID = req.query.productID;
  if (productID) {
    console.log("Product ID: ", productID);
    Product.findByPk(productID).then(product=>{
      if(product)
      {
        res.render('admin/edit-product', {
          pageTitle: 'Edit Product',
          path: '/admin/edit-product',
          formsCSS: true,
          productCSS: true,
          product: product
        });
      }else{
        res.redirect('/');
      }

    }).catch(err=>{
      console.log(err);
    });

  } else {
    res.redirect('/');

  }
};

exports.postEditProduct = (req, res, next) => {
  console.log('PostEdit');
  const productID = req.body.productID;
  const newTitle = req.body.title;
  const newImgUrl = req.body.imageUrl;
  const newPrice = req.body.price;
  const newDesc = req.body.description;
  Product.findByPk(productID).then(product=>{
    product.title=newTitle;
    product.description=newDesc;
    product.price=newPrice;
    product.imageUrl=newImgUrl;
    return product.save()
  }).then(result=>{
    console.log("Product Updated!");
    res.redirect('/admin/products')
  }).catch(err=>{console.log(err)});
};


exports.postDeleteProduct = (req, res, next) => {
  const productID = req.body.productID;
  console.log('deletion id: ' , productID);
  Product.findByPk(productID).then(product=>{
    return product.destroy();
  }).then(result=>{
    console.log("Product Deleted!");
    res.redirect('/admin/products');
  }).catch(err=>{
    console.log("Deletion Error: ", err);
  })
};

exports.getProducts = (req, res, next) => {
  Product.findAll().then(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  }).catch(err=>{
    console.log(err);
  });
};
