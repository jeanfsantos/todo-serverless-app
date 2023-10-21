import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils'
import { createTodo } from '../../helpers/todos'
import { createLogger } from '../../utils/logger'

const logger = createLogger('createTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // TODO: Implement creating a new TODO item
    try {
      const newTodo: CreateTodoRequest = JSON.parse(event.body)
      logger.info(`creating todo item: `, { item: newTodo })

      const userId = getUserId(event)

      const item = await createTodo(newTodo, userId)

      return {
        statusCode: 201,
        body: JSON.stringify({
          item
        })
      }
    } catch (e) {
      logger.error(`Fail to create todo item `, { error: e })

      return {
        statusCode: 500,
        body: JSON.stringify({
          message: 'Unexpected Error'
        })
      }
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
