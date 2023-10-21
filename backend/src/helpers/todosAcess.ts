import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
// import { TodoUpdate } from '../models/TodoUpdate'

// const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic

export class TodosAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE
  ) {}

  async createTodoItem(todo: TodoItem): Promise<TodoItem> {
    logger.info('Creating new todo item')

    await this.docClient
      .put({
        TableName: this.todosTable,
        Item: todo
      })
      .promise()

    logger.info('Created new todo item')
    return todo
  }

  async getTodos(userId: string): Promise<TodoItem[]> {
    logger.info(`Getting all Todos for user ${userId}`)

    const params = {
      TableName: this.todosTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }
    const res = await this.docClient.query(params).promise()
    const items = res.Items as TodoItem[]
    return items
  }
}

function createDynamoDBClient(): DocumentClient {
  const service = new AWS.DynamoDB()
  const client = new AWS.DynamoDB.DocumentClient({
    service: service
  })

  AWSXRay.captureAWSClient(service)
  return client
}
