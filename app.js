import express from 'express'
import routerTodo from './controller/todoController.js'
const app = express()

app.use(express.static('public'))
// Su código debe ir aquí...
app.use(express.json())
app.use('/', routerTodo)
app.set('view engine', 'ejs')
app.get('/test', (req, res) => {
	res.render('pages/index', { nombre: 'manuel' })
})

// ... hasta aquí

export default app
