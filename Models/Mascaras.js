const Sequelize = require("sequelize");
const conn = require("../database/database");

const Mascaras = conn.define('mascaras',{
    formato:{
        type: Sequelize.STRING,
        allowNull: false
    },
    divisor:{
        type: Sequelize.STRING,
        allowNull: false
    },
    quantidadePos:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    reallPos:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    partNumberPos:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    lotePos:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
})


// Clientes.sync({force: true});

module.exports = Mascaras;