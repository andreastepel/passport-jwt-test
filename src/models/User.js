'use strict'

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    bio: DataTypes.STRING,
    isVerified: DataTypes.BOOLEAN,
    resetPasswordToken: DataTypes.STRING,
    resetPasswordExpires: DataTypes.DATE,
  })

  // Associations
  User.associate = (models) => {
    User.hasMany(models.Token, {
      foreignKey: 'userId',
      as: 'tokens',
      onDelete: 'cascade',
    })
  }

  User.beforeCreate((user) => {
    if (!user.changed('password')) return

    bcrypt.genSalt(10, function (err, salt) {
      if (err) return

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return

        user.password = hash
      })
    })
  })

  User.prototype.comparePassword = (password) => {
    return bcrypt.compareSync(password, this.password)
  }

  User.prototype.generateJWT = () => {
    const today = new Date()
    const expirationDate = new Date(today)
    expirationDate.setDate(today.getDate() + 60)

    let payload = {
      id: this._id,
      email: this.email,
      username: this.username,
      firstName: this.firstName,
      lastName: this.lastName,
    }

    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: parseInt(expirationDate.getTime() / 1000, 10),
    })
  }

  User.prototype.generatePasswordReset = () => {
    this.resetPasswordToken = crypto.randomBytes(20).toString('hex')
    this.resetPasswordExpires = Date.now() + 3600000 //expires in an hour
  }

  User.prototype.generateVerificationToken = async () => {
    console.log(this)
    let payload = {
      userId: this.id,
      token: crypto.randomBytes(20).toString('hex'),
    }

    let token = sequelize.models.Token.build(payload)

    return token
  }

  return User
}
