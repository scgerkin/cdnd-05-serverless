import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserId } from '../utils'
import { deleteTodo } from '../../services/todoService';
import { createLogger } from '../../utils/logger';
import { TodoCompositeId } from '../../models/TodoCompositeId';

const logger = createLogger('deleteTodo');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  let userId: string;
  try {
    userId = getUserId(event);
    logger.debug("User ID", {userId: userId});
  }
  catch (error) {
    logger.error("Error retrieving User ID", {error: error});
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(error)
    }
  }

  const todoCompositeId: TodoCompositeId = ({
    userId: userId,
    todoId: todoId
  });

  logger.info("Composite ID", {compositeId: todoCompositeId})

  try {
    await deleteTodo(todoCompositeId);
  }
  catch (error) {
    logger.error("Error deleting Todo Item", {error: error});
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(error)
    }
  }

  logger.info("Deleted Item by todo ID", {todoId: todoId});
  return {
    statusCode: 202,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: ""
  }
}
