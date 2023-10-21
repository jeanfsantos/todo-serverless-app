import { TodosAccess } from './todosAcess'
// import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import { TodoUpdate } from '../models/TodoUpdate'
// import * as createError from 'http-errors'

// TODO: Implement businessLogic
const logger = createLogger('Todos')
const todosAccess = new TodosAccess()

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {
  logger.info(`Creating new Todo for user ${userId}`)

  const todoId = uuid.v4()
  const timestamp = new Date().toISOString()

  return await todosAccess.createTodoItem({
    userId: userId,
    todoId: todoId,
    createdAt: timestamp,
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    done: false
  })
}

export async function getTodos(userId: string): Promise<TodoItem[]> {
  logger.info(`Getting all Todos for user ${userId}`)

  return await todosAccess.getTodos(userId)
}

export async function updateTodoItem(
  todoId: string,
  updatedTodo: UpdateTodoRequest,
  userId: string
): Promise<TodoUpdate> {
  logger.info(`Udating todo ${todoId} of user ${userId}`)

  const { name, dueDate, done } = updatedTodo

  return await todosAccess.updateTodoItem(
    todoId,
    {
      name,
      dueDate,
      done
    },
    userId
  )
}
