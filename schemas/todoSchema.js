import { object, string, boolean } from "yup";


export const createTodoSchema = object({
	title: string().required(),
})

export const updateTodoSchema = object({
	title: string().optional(),
	completed: boolean().optional()
})