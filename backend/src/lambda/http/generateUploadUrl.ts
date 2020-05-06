import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import * as DynamoDB from 'aws-sdk/clients/dynamodb'
import * as AWS  from 'aws-sdk'

import * as uuid from 'uuid'

import { createLogger } from '../../utils/logger'
import { TodoItem } from '../../models/TodoItem'
//import { updateExisting } from '../../services/todoService'
import { TodoCompositeId } from '../../models/TodoCompositeId'
import { getUserId } from '../utils'
import { TodoRepository } from '../../repository/todoRepository'

const logger = createLogger('generateUploadUrl');
const docClient: DocumentClient = new DynamoDB.DocumentClient();
const s3 = new AWS.S3({
  signatureVersion: 'v4'
});

const repo = new TodoRepository();

const todosTable = process.env.TODOS_TABLE;
const bucketName = process.env.IMAGES_BUCKET;
const urlExpiration = process.env.URL_EXPIRATION;

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId;
  const existingTodo: TodoItem = await getExistingTodoItem(todoId, event);

  if (!existingTodo) {
    return {
      statusCode: 404,
      body: `Todo with id '${todoId}' not found`
    };
  }

  const imageId = uuid.v4();

  const todoWithImage = await updateItemWithImageUrl(existingTodo, imageId);

  const url = s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: imageId,
    Expires: urlExpiration
  });

  return {
    statusCode: 201,
    body: JSON.stringify({
      uploadUrl: url
    })
  }
}

async function getExistingTodoItem(todoId: string, event: APIGatewayProxyEvent): Promise<TodoItem> {
  return await repo.getByTodoId({userId: getUserId(event), todoId: todoId});
}

async function updateItemWithImageUrl(existingTodo: TodoItem, imageId: string): Promise<TodoItem> {
  existingTodo.attachmentUrl = `https://${bucketName}.s3.amazonaws.com/${imageId}`;
  console.log(existingTodo);

  const updatedTodo = await repo.updateExisting(existingTodo);
  logger.debug("Updated Todo", updatedTodo);
  return updatedTodo;
}
