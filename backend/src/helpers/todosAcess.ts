import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

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

  async updateTodoItem(
    todoId: string,
    todo: TodoUpdate,
    userId: string
  ): Promise<TodoUpdate> {
    logger.info(`updating todo item for user ${userId} and ${todoId}`)

    const params = {
      TableName: this.todosTable,
      Key: {
        userId: userId,
        todoId: todoId
      },
      ExpressionAttributeNames: {
        '#todo_name': 'name'
      },
      ExpressionAttributeValues: {
        ':name': todo.name,
        ':dueDate': todo.dueDate,
        ':done': todo.done
      },
      UpdateExpression:
        'SET #todo_name = :name, dueDate = :dueDate, done = :done',
      ReturnValues: 'ALL_NEW'
    }

    const result = await this.docClient.update(params).promise()

    logger.info(`Result of update statement `, { result })

    return result.Attributes as TodoUpdate
  }

  async deleteTodoItem(todoId: string, userId: string): Promise<void> {
    logger.info(`deleting todo ${todoId} of user ${userId}`)

    await this.docClient
      .delete({
        TableName: this.todosTable,
        Key: {
          userId: userId,
          todoId: todoId
        }
      })
      .promise()

    logger.info('deleted successfully')
  }

  async updateAttachmentUrl(
    todoId: string,
    attachmentUrl: string,
    userId: string
  ): Promise<void> {
    logger.info(
      `updating attachment url for ${userId} and ${todoId} with url ${attachmentUrl}`
    )

    const params = {
      TableName: this.todosTable,
      Key: {
        userId: userId,
        todoId: todoId
      },
      ExpressionAttributeNames: {
        '#todo_attachmentUrl': 'attachmentUrl'
      },
      ExpressionAttributeValues: {
        ':attachmentUrl': attachmentUrl
      },
      UpdateExpression: 'SET #todo_attachmentUrl = :attachmentUrl',
      ReturnValues: 'ALL_NEW'
    }

    const result = await this.docClient.update(params).promise()

    logger.info(`Result of update statement`, { result: result })
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
