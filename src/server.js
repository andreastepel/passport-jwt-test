require('dotenv').config()

const express = require('express')
const cors = require('cors')
const passport = require('passport')
const path = require('path')

// Setting up port
let PORT = process.env.PORT || 3000

//=== 1 - CREATE APP
// Creating express app and configuring middleware needed for authentication
const app = express()

app.use(cors())

// for parsing application/json
app.use(express.json())

// for parsing application/xwww-
app.use(express.urlencoded({ extended: false }))
//form-urlencoded

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

//=== 3 - INITIALIZE PASSPORT MIDDLEWARE
app.use(passport.initialize())
require('./middlewares/jwt')(passport)

//=== 4 - CONFIGURE ROUTES
//Configure Route
require('./routes/index')(app)

//=== 5 - START SERVER
app.listen(PORT, () =>
  console.log('Server running on http://localhost:' + PORT + '/')
)
