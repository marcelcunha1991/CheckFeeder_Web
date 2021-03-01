const Sequelize = require("sequelize");


// PARAMETROS DE CONEXAO PARA BANCO SQL

const conn = new Sequelize('checkfeeder','root','sa123',{
    host: 'localhost',
    dialect: 'mysql',
    port:3307,
    timezone:"-04:00",
    logging: false
})

// PARAMETROS DE CONEXAO PARA BANCO SQLSERVER - OPCAO 01

// const conn = new Sequelize('fichatecnica', 'root', 'sa123', {
//     host: 'localhost',
//     dialect: 'mssql',
//     timezone:"-04:00",
//     dialectOptions: {
//         options: {
//             encrypt: true,
//         }
//     }
//   });

// PARAMETROS DE CONEXAO PARA BANCO SQLSERVER - OPCAO 02
//   var conn = new Sequelize({
//     dialect: 'mssql',
//     dialectModulePath: 'sequelize-msnodesqlv8',
//     dialectOptions: {
//       instanceName: 'MSSQLSERVER01',
//       trustedConnection: true
//     },
//     host: 'localhost',
//     database: 'fichatecnica'
//   });

module.exports = conn;