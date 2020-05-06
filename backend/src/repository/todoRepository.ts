import * as DynamoDB from 'aws-sdk/clients/dynamodb'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { TodoItem } from '../models/TodoItem'
import { DeleteTodoRequest } from '../requests/DeleteTodoRequest'

import { createLogger } from '../utils/logger'

const logger = createLogger('TodoRepository');

export class TodoRepository {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todoTable = process.env.TODOS_TABLE,
    private readonly userIdIndex = process.env.USER_ID_INDEX
  ) {}

  async getAllByUser(userId: string): Promise<TodoItem[]> {
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

  async addNew(todoItem: TodoItem): Promise<TodoItem> {
    logger.info("Initiate 'createTodo'", todoItem);

    await this.docClient.put({
      TableName: this.todoTable,
      Item: todoItem
    }).promise();

    return todoItem;
  }

  async delete(deleteRequest: DeleteTodoRequest): Promise<any> {
    logger.info("Initiate delete", deleteRequest);
    await this.docClient.delete({
      TableName: this.todoTable,
      Key: {
        "userId": deleteRequest.userId,
        "todoId": deleteRequest.todoId
      }
    }).promise();

  }
}

function createDynamoDBClient() {
  return new DynamoDB.DocumentClient();
}
