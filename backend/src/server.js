const express = require('express')
const cors = require('cors')
const connection = require('./db_config')
const app = express()

app.use(cors())
app.use(express.json())

const port = 3000