require('dotenv').config() // this is important!
module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: 0,
    operatorsAliases: 0,
    minifyAliases: 1,
  },
}
