'use strict'

module.exports = (sequelize, DataTypes) => {
  const Token = sequelize.define('Token', {
    token: DataTypes.STRING,
    userId: DataTypes.INTEGER,
  })

  // Associations
  Token.associate = function (models) {
    Token.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
      onDelete: 'cascade',
    })
  }

  return Token
}
