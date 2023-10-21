import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { getUserId } from '../utils'
import { deleteTodoItem } from '../../helpers/todos'
import { createLogger } from '../../utils/logger'

const logger = createLogger('deleteTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      // TODO: Remove a TODO item by id
      const todoId = event.pathParameters.todoId

      logger.info(`deleting todo id: ${todoId}`)

      const userId = getUserId(event)

      await deleteTodoItem(todoId, userId)

      return {
        statusCode: 204,
        body: ''
      }
    } catch (e) {
      logger.error(`Fail to delete todo item `, { error: e })

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
