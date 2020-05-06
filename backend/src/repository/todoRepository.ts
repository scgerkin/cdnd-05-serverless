import * as AWS from 'aws-sdk'

import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { TodoItem } from '../models/TodoItem'
import * as DynamoDB from 'aws-sdk/clients/dynamodb'

import { createLogger } from '../utils/logger'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'

const logger = createLogger('TodoRepository');

export class TodoRepository {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todoTable = process.env.TODOS_TABLE,
    private readonly userIdIndex = process.env.USER_ID_INDEX
  ) {}

  async getAllTodos(userId): Promise<TodoItem[]> {
    logger.info('Initiate \'getAllTodos\'', userId);

    const scanResult = await this.docClient.query({
      TableName: this.todoTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }).promise();


    logger.info('Scan result', scanResult);
    const items = scanResult.Items;

    logger.info('Items', items);
    return items as TodoItem[];
  }

  async createTodo(todoItem: TodoItem): Promise<TodoItem> {
    logger.info("Initiate 'createTodo'", todoItem);

    await this.docClient.put({
      TableName: this.todoTable,
      Item: todoItem
    }).promise();

    return todoItem;
  }
}

function createDynamoDBClient() {
  return new DynamoDB.DocumentClient();
}
