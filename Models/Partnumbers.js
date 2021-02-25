const Sequelize = require("sequelize");
const conn = require("../database/database");
const Fabricante = require("./Fabricantes");


const Partnumber = conn.define('partnumbers',{
    codigo:{
        type: Sequelize.STRING,
        allowNull: false
    }
})


Partnumber.belongsTo(Fabricante)
// Clientes.sync({force: true});

module.exports = Partnumber; 