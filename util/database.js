
const {Sequelize} = require('sequelize');

const sequelize = new  Sequelize('nodeshop', 'NodeShopUser', 'testPass@', {
host: 'localhost',
dialect: 'mysql'
});

module.exports = sequelize;