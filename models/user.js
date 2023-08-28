const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const User = sequelize.define('user',{
    id:{
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,

    },
    name:{
        type:Sequelize.STRING,
        allowNull: false,

    },
    email:{
        type: Sequelize.STRING,
        allowNull: false,
    }
});
module.exports = User;