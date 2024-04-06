import express from 'express'
import { scrypt, randomBytes, randomUUID } from 'node:crypto'

const app = express()

const users = [{
	username: 'admin',
	name: 'Gustavo Alfredo Marín Sáez',
	password: '1b6ce880ac388eb7fcb6bcaf95e20083:341dfbbe86013c940c8e898b437aa82fe575876f2946a2ad744a0c51501c7dfe6d7e5a31c58d2adc7a7dc4b87927594275ca235276accc9f628697a4c00b4e01' // certamen123
}, {
	username: 'test',
	name: 'manuel eduardo monjes sandoval',
	password: '85eb5e9622fdc536bb3c1285a6696068:dfec254d4d1b867fdad3b7c2d46d7f7489ea3e523a4fea91a882043adaabbd40467d1211181963cb80e5dfdb4ab7ed21a890b14eaeb7cad292b373b44669c7b1' // manuel
}]
const todos = [{
	id: '1234',
	title: 'terminar certamen',
	completed: false,
}, {
	id: '1',
	title: 'terminar certamen',
	completed: false,
},
{
	id: '14',
	title: 'terminar certamen',
	completed: false,
}
]

app.use(express.static('public'))
// Su código debe ir aquí...
app.use(express.json())
app.get('/api', (req, res) => {
	res.setHeader('Content-Type', 'text/plain');
	res.status(200);
	res.send('Hello World!');
});

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

	const [salt, key] = usuarioBuscado.password.split(':')
	scrypt(password, salt, 64, (err, derivedkey) => {
		if (key === derivedkey.toString('hex')) {
			const TOKEN = randomBytes(48).toString('hex')
			const updateUser = {
				...usuarioBuscado,
				token: TOKEN,
			}

			const indexUser = users.findIndex(us => us.password === usuarioBuscado.password)
			users[indexUser] = updateUser;


			res.status(200);
			res.setHeader('X-Authorization', updateUser.token)
			res.send({
				username: updateUser.username,
				name: updateUser.name,
				token: TOKEN
			})

		} else {
			res.status(401);
			res.send('el usuario y/o contrasena es incorrecta');
			return
		}
	})

});

function validateToken(req, res, next) {
	const token = req.headers['x-authorization']

	const tokenFind = users.find((user) => user.token === token)
	console.log(tokenFind)

	next();
};


app.get('/api/todos/:id', (req, res) => {
	console.log(req.params);
	res.send('enviado por parametro de ruta');
})

app.get('/api/todos', validateToken, (req, res) => {
	res.status(200);
	res.setHeader('Content-Type', 'application/json');
	res.send(todos);
});

app.post('/api/todos', (req, res) => {
	const { title } = req.body;
	if (title === '') {
		res.status(400);
		res.send('el titulo no fue enviado correctamente')
		return
	};

	const newTodo = {
		id: randomUUID(),
		title: title,
		completed: false,
	};

	todos.push(newTodo);

	res.status(201);
	res.send(newTodo);
});

app.put('/api/todos/:id', (req, res) => {
	const { id } = req.params;
	const { title, completed } = req.body;

	if (id === undefined) {
		return
	}
	const elementFind = todos.find(todo => todo.id === id);
	if (elementFind === undefined) {
		res.status(404)
		res.send('el item a modificar no existe')
		return
	}

	if (title !== undefined) {
		elementFind.title = title
		res.status(200)
		res.send(elementFind)
		return;
	}

	if (completed === true) {
		elementFind.completed = true;
		res.status(200)
		res.send(elementFind)
		return
	}
	if (completed === false) {
		elementFind.completed = false;
		res.status(200)
		res.send(elementFind)
		return
	}
	console.log(elementFind)

})

app.delete('/api/todos/:id', (req, res) => {
	const { id } = req.params
	const todoIndex = todos.findIndex(todo => todo.id === id);
	if (todoIndex === -1) {
		res.status(404);
		return
	}
	todos.splice(todoIndex, 1)
	res.status(204)
	res.send(todos);

})

// ... hasta aquí

export default app