import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { getUserId } from '../utils'
import { createAttachmentPresignedUrl } from '../../helpers/todos'
import { createLogger } from '../../utils/logger'

const logger = createLogger('generateUploadUrl')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
      logger.info(`creating a presigned URL to upload a file for a TODO item`)

      const todoId = event.pathParameters.todoId
      const userId = getUserId(event)

      const uploadUrl = await createAttachmentPresignedUrl(todoId, userId)

      return {
        statusCode: 201,
        body: JSON.stringify({
          uploadUrl
        })
      }
    } catch (e) {
      logger.error(
        `Fail to return a presigned URL to upload a file for a TODO item `,
        { error: e }
      )

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
