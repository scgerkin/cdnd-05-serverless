import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import 'source-map-support/register'
import * as uuid from 'uuid'
import { TodoItem } from '../../models/TodoItem'
import { TodoRepository } from '../../repository/todoRepository'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const logger = createLogger('generateUploadUrl');

const s3 = new AWS.S3({
  signatureVersion: 'v4'
});

const repo = new TodoRepository();

const bucketName = process.env.IMAGES_BUCKET;
const urlExpiration = process.env.URL_EXPIRATION;

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId;
  const existingTodo: TodoItem = await getExistingTodoItem(todoId, event);

  if (!existingTodo) {
    logger.error("Could not find existing todo.", {todoId: todoId});
    return {
      statusCode: 404,
      body: JSON.stringify({error:`Todo with id '${todoId}' not found`})
    };
  }

  const imageId = uuid.v4();

  try {
    await updateItemWithImageUrl(existingTodo, imageId);
  }
  catch (error) {
    logger.error("Could not update with image url", {error: error});
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: error
      })
    }
  }

  let url: string;
  try {
    url = s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: imageId,
      Expires: urlExpiration
    });
    logger.info("Signed url", {url: url});
  }
  catch (error) {
    logger.error("Error creating signed url", {error: error});
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({error: error})
    }
  }


  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      uploadUrl: url
    })
  }
}

async function getExistingTodoItem(todoId: string, event: APIGatewayProxyEvent): Promise<TodoItem> {
  return await repo.getByTodoId({ userId: getUserId(event), todoId: todoId });
}

async function updateItemWithImageUrl(existingTodo: TodoItem, imageId: string): Promise<TodoItem> {
  existingTodo.attachmentUrl = `https://${bucketName}.s3.amazonaws.com/${imageId}`;
  console.log(existingTodo);

  const updatedTodo = await repo.updateExisting(existingTodo);
  logger.debug("Updated Todo", updatedTodo);
  return updatedTodo;
}
