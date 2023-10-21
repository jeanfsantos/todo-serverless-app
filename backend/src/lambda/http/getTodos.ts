import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
import { getTodos } from '../../helpers/todos'

const logger = createLogger('getTodos')

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    try {
      logger.info(`Get all TODO items for a current user`)

      const userId = getUserId(event)

      const todos = await getTodos(userId)

      return {
        statusCode: 200,
        body: JSON.stringify({
          items: todos
        })
      }
    } catch (e) {
      logger.error(`Fail to get all Todos `, { error: e })

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
