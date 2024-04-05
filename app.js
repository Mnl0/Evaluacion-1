import express from 'express'
import { scrypt, randomBytes, randomUUID } from 'node:crypto'

const app = express()

const users = [{
	username: 'admin',
	name: 'Gustavo Alfredo Marín Sáez',
	password: '1b6ce880ac388eb7fcb6bcaf95e20083:341dfbbe86013c940c8e898b437aa82fe575876f2946a2ad744a0c51501c7dfe6d7e5a31c58d2adc7a7dc4b87927594275ca235276accc9f628697a4c00b4e01' // certamen123
}]
const todos = []

app.use(express.static('public'))
// Su código debe ir aquí...
app.use(express.json())
app.get('/api', (req, res) => {
	res.setHeader('Content-Type', 'text/plain');
	res.status(200);
	res.send('Hello World!');
})

app.post('/api/login', (req, res) => {
	const { username, password } = req.body;

	if (typeof username !== 'string' || typeof password !== 'string') {
		res.status(400);
		res.send('el formato ingresado es incorrecto');
		return;
	}

	if (username === '' || password === '') {
		res.status(400);
		res.send('la api no recibió username y/o password en el formato correcto');
		return;
	}

	const usuarioBuscado = users.find(user => user.username === username);
	if (usuarioBuscado === undefined) {
		res.status(401);
		res.send('el usuario y/o contrasena es incorrecta');
		return;
	}

	if (usuarioBuscado.password !== password) {
		res.status(401);
		res.send('el usuario y/o contrasena es incorrecta');
		console.log('password incorrecto')
		return;
	}





})



// ... hasta aquí

export default app