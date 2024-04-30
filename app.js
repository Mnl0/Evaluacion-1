import express from 'express'
import routerTodo from './controller/todoController.js'
const app = express()

app.use(express.static('public'))
// Su código debe ir aquí...
app.use(express.json())
app.use('/', routerTodo)

// ... hasta aquí

export default app
