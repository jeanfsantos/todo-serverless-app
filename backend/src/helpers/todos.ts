import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import { AttachmentUtils } from './attachmentUtils'
import { TodosAccess } from './todosAcess'
// import * as createError from 'http-errors'

// TODO: Implement businessLogic
const logger = createLogger('Todos')
const todosAccess = new TodosAccess()
const attachmentUtils = new AttachmentUtils()

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

export async function deleteTodoItem(
  todoId: string,
  userId: string
): Promise<void> {
  logger.info(`Deleting todo ${todoId} of user ${userId}`)

  await todosAccess.deleteTodoItem(todoId, userId)
}

export async function createAttachmentPresignedUrl(
  todoId: string,
  userId: string
): Promise<String> {
  const uploadUrl = await attachmentUtils.getUploadUrl(todoId)
  logger.info(`upload url is ${uploadUrl}`)

  const attachmentUrl = attachmentUtils.getAttachmentUrl(todoId)
  logger.info(`attachmentUrl is ${attachmentUrl}`)

  await todosAccess.updateAttachmentUrl(todoId, attachmentUrl, userId)
  logger.info(`updated attachment url for todo ${todoId} of user ${userId}`)

  return uploadUrl
}
