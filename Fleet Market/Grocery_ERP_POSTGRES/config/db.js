const Sequelize = require('sequelize');

module.exports =  new Sequelize('grocery','postgres','Jesus', {
  host: 'localhost',
  dialect: 'postgres',
  omitNull: true,
  operatorsAliases: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: false
}
});