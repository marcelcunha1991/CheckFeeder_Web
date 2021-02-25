const Sequelize = require("sequelize");
const conn = require("../database/database");
const Mascaras = require("./Mascaras");

const Fabricantes = conn.define('fabricantes',{
    codigo:{
        type: Sequelize.STRING,
        allowNull: false
    },
    descricao: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    }
    
})

Fabricantes.belongsTo(Mascaras)
// Clientes.sync({force: true});

module.exports = Fabricantes;