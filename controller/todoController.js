import express from 'express'
import { scrypt, randomBytes } from 'node:crypto'
import { getTodo, getUser, getAllTodo, createTodo, getUsTk, deleteTodo, editTodo } from '../repositories/todoRepositories.js';
import { createTodoSchema, updateTodoSchema } from '../schemas/todoSchema.js';

const routerTodo = express.Router();

function validateToken(req, res, next) {

	const token = req.get('x-authorization')
	if (!token) {
		return res.sendStatus(401)
	}

	const tokenFind = getUsTk(token);

	if (!tokenFind) {
		return res.sendStatus(401);
	}
	next();
}

function callMiddleware(funcionSchema) {
	return middlewareSchema(funcionSchema)
}

function middlewareSchema(funcionSchema) {
	return (req, res, next) => {
		let todo
		try {
			todo = funcionSchema.validateSync(req.body, {
				stripUnknow: true,
			})
		} catch (ex) {
			return res.status(400).send(ex)
		}
		next()
		return todo
	}
}

routerTodo.get('/api', (req, res) => {
	res.setHeader('Content-Type', 'text/plain').send('Hello World!');
});

routerTodo.post('/api/login', (req, res) => {
	const { username, password } = req.body;

	if (typeof username !== 'string' || typeof password !== 'string') {
		return res.sendStatus(400);
	}

	const usuarioBuscado = getUser(username)

	if (!usuarioBuscado) {
		return res.sendStatus(401);
	}

	const [salt, key] = usuarioBuscado.password.split(':')

	scrypt(password, salt, 64, (err, derivedkey) => {
		if (key === derivedkey.toString('hex')) {

			usuarioBuscado.token = randomBytes(48).toString('hex')

			res.send({
				username: usuarioBuscado.username,
				name: usuarioBuscado.name,
				token: usuarioBuscado.token
			})

		} else {
			return res.status(401).send('usuario y/o contrasena incorrecta');
		}
	})

});

routerTodo.get('/api/todos', validateToken, (req, res) => {
	res.send(getAllTodo());
});

routerTodo.get('/api/todos/:id', validateToken, (req, res) => {
	const elementFind = getTodo(req.params.id);
	if (!elementFind) {
		return res.status(404).send('item no existe');
	}
	res.send(elementFind)
})

routerTodo.post('/api/todos', validateToken, callMiddleware(createTodoSchema), (req, res) => {
	res.status(201).send(createTodo(req.body.title));
});

routerTodo.put('/api/todos/:id', validateToken, callMiddleware(updateTodoSchema), (req, res) => {
	const todo = editTodo(req.params.id, req.body)
	if (todo) {
		res.send(todo)
	} else {
		res.sendStatus(404)
	}

})

routerTodo.delete('/api/todos/:id', validateToken, (req, res) => {
	if (deleteTodo(req.params.id)) {
		res.status(204).send();
	} else {
		return res.status(404).json('item no existe')
	}
})

export default routerTodo;