import { randomUUID } from 'node:crypto'
const users = [{
	username: 'admin',
	name: 'Gustavo Alfredo Marín Sáez',
	password: '1b6ce880ac388eb7fcb6bcaf95e20083:341dfbbe86013c940c8e898b437aa82fe575876f2946a2ad744a0c51501c7dfe6d7e5a31c58d2adc7a7dc4b87927594275ca235276accc9f628697a4c00b4e01' // certamen123
}, {
	username: 'test',
	name: 'manuel eduardo monjes sandoval',
	password: '85eb5e9622fdc536bb3c1285a6696068:dfec254d4d1b867fdad3b7c2d46d7f7489ea3e523a4fea91a882043adaabbd40467d1211181963cb80e5dfdb4ab7ed21a890b14eaeb7cad292b373b44669c7b1' // manuel
}]

export const todos = [{
	id: '1234',
	title: 'terminar certamen',
	completed: false,
}
]

export function getAllTodo() {
	return todos
}

export function getUser(usName) {
	return users.find(us => us.username === usName) ?? null
}

export function getTodo(id) {
	return todos.find(todo => todo.id === id) ?? null
}

export function createTodo(todoTitle) {
	const newTodo = {
		title: todoTitle,
		completed: false,
		id: randomUUID(),
	}
	todos.push(newTodo)
	return newTodo
}

export function getIndexTodo(id) {
	return todos.findIndex(idx => idx.id === id)
}

export function deleteTodo(id) {
	const idxTodo = getIndexTodo(id)

	if (idxTodo === -1) {
		return false
	}

	todos.splice(idxTodo, 1)
	return true
}

export function getUsTk(tk) {
	return users.find(user => user.token === tk) ?? null
}

export function editTodo(id, todo) {
	const todoFind = getTodo(id)

	if (!todoFind) {
		return null
	}

	todoFind.title = todo.title ?? todoFind.title
	todoFind.completed = todo.completed ?? todoFind.completed

	return todoFind

}