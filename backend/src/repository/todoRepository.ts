import * as DynamoDB from 'aws-sdk/clients/dynamodb'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { TodoCompositeId } from '../models/TodoCompositeId'
import { TodoItem } from '../models/TodoItem'

import { createLogger } from '../utils/logger'

const logger = createLogger('TodoRepository');

// CONSIDER refactoring as functions rather than class for optimization
export class TodoRepository {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todoTable = process.env.TODOS_TABLE,
    private readonly userIdIndex = process.env.USER_ID_INDEX
  ) {}

  async getAllByUserId(userId: string): Promise<TodoItem[]> {
    logger.debug('Initiate \'getAllTodos\'', userId);

    const result = await this.docClient.query({
      TableName: this.todoTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }).promise();


    logger.debug('Query result', result);
    const items = result.Items;

    logger.debug('Items', items);
    return items as TodoItem[];
  }

  // TODO use .get(TableName: xxx, Key {id: xxx})
  async getByTodoId(compositeId: TodoCompositeId): Promise<TodoItem> {
    const result = await this.docClient.query({
      TableName: this.todoTable,
      KeyConditionExpression: 'userId = :userId AND todoId = :todoId',
      ExpressionAttributeValues: {
        ':userId': compositeId.userId,
        ':todoId': compositeId.todoId
      }
    }).promise();

    const items = result.Items;
    logger.debug('Result Items', items);
    return items[0] as TodoItem;
  }

  async put(todoItem: TodoItem): Promise<TodoItem> {
    logger.debug("Initiate 'put'", todoItem);

    await this.docClient.put({
      TableName: this.todoTable,
      Item: todoItem
    }).promise();

    return todoItem;
  }

  async updateExisting(todoItem: TodoItem): Promise<TodoItem> {
    logger.debug("Initiate update", todoItem);

    const result: DynamoDB.UpdateItemOutput = await this.docClient.update({
      TableName: this.todoTable,
      Key: {
        userId: todoItem.userId,
        todoId: todoItem.todoId
      },
      UpdateExpression: "set done = :done, dueDate = :dueDate, attachmentUrl = :attachmentUrl",
      ExpressionAttributeValues: {
        ":done": todoItem.done,
        ":dueDate": todoItem.dueDate,
        ":attachmentUrl": todoItem.attachmentUrl
      },
      ReturnValues:"UPDATED_NEW"
    }).promise();

    return result as TodoItem;
  }

  async delete(compositeId: TodoCompositeId): Promise<any> {
    logger.debug("Initiate delete", compositeId);
    await this.docClient.delete({
      TableName: this.todoTable,
      Key: {
        "userId": compositeId.userId,
        "todoId": compositeId.todoId
      }
    }).promise();
  }
}

function createDynamoDBClient() {
  return new DynamoDB.DocumentClient();
}
