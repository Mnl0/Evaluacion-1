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

function validateToken(req, res, next) {
	const token = req.headers['x-authorization']

	if (!token) {
		return res.sendStatus(401)
	}

	const tokenFind = users.find((user) => user.token === token);

	if (!tokenFind) {
		return res.sendStatus(401);
	}
	next();
};

app.get('/api', (req, res) => {
	res.setHeader('Content-Type', 'text/plain').send('Hello World!');
});

app.post('/api/login', (req, res) => {
	const { username, password } = req.body;

	if (typeof username !== 'string' || typeof password !== 'string') {
		return res.sendStatus(400);
	}

	const usuarioBuscado = users.find(user => user.username === username);

	if (!usuarioBuscado) {
		return res.sendStatus(401);
	}

	const [salt, key] = usuarioBuscado.password.split(':')

	scrypt(password, salt, 64, (err, derivedkey) => {
		if (key === derivedkey.toString('hex')) {
			const TOKEN = randomBytes(48).toString('hex')
			const updateUser = {
				...usuarioBuscado,
				token: TOKEN,
			};

			const indexUser = users.findIndex(us => us.password === usuarioBuscado.password)

			users[indexUser] = updateUser;

			res.send({
				username: updateUser.username,
				name: updateUser.name,
				token: updateUser.token
			})

		} else {
			return res.status(401).send('usuario y/o contrasena incorrecta');
		}
	})

});

app.get('/api/todos', validateToken, (req, res) => {
	res.send(todos);
});

app.get('/api/todos/:id', validateToken, (req, res) => {
	const { id } = req.params;
	const elementFind = todos.find(todo => todo.id === id);
	if (!elementFind) {
		return res.status(404).send('item no existe');
	}
	res.send(elementFind)
})

app.post('/api/todos', validateToken, (req, res) => {
	const { title } = req.body;
	if (typeof title !== 'string') {
		return res.status(400).json('title no fue enviado correctamente')
	};

	const newTodo = {
		id: randomUUID(),
		title: title,
		completed: false,
	};

	todos.push(newTodo);

	res.status(201).send(newTodo);
});

app.put('/api/todos/:id', validateToken, (req, res) => {
	const { id } = req.params;
	const { title, completed } = req.body;

	const elementFind = todos.find(todo => todo.id === id);

	if (!elementFind) {
		return res.status(404).json('Item no encontrado')
	}

	if ((title !== undefined && typeof title !== 'string') || (completed !== undefined && typeof completed !== 'boolean')) {
		return res.status(400).json('Formato Incorrecto')
	}

	if (typeof title === 'string') {
		elementFind.title = title
	}

	if (typeof completed === 'boolean') {
		elementFind.completed = completed
	}

	res.status(200).send(elementFind)

})

app.delete('/api/todos/:id', validateToken, (req, res) => {
	const { id } = req.params
	const todoIndex = todos.findIndex(todo => todo.id === id);
	if (todoIndex === -1) {
		return res.status(404).json('item no existe')
	}
	todos.splice(todoIndex, 1)
	res.status(204).send(todos);

})

// ... hasta aquí

export default app
