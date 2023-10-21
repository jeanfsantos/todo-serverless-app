import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

// import { updateTodo } from '../../businessLogic/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
import { updateTodoItem } from '../../helpers/todos'

const logger = createLogger('updateTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      logger.info(`Update TODO item for a current user`)

      const userId = getUserId(event)
      const todoId = event.pathParameters.todoId
      const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
      // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object

      const todoItem = await updateTodoItem(todoId, updatedTodo, userId)
      logger.info(`Updated TODO item `, { item: todoItem })

      return {
        statusCode: 204,
        body: ''
      }
    } catch (e) {
      logger.error(`Fail to update todo item `, { error: e })

      return {
        statusCode: 500,
        body: JSON.stringify({
          message: 'Unexpected Error'
        })
      }
    }
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
