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
    logger.debug("User ID", userId);
  }
  catch (error) {
    logger.error("Error retrieving User ID", error);
    return {
      statusCode: 400,
      body: JSON.stringify(error)
    }
  }

  const todoCompositeId: TodoCompositeId = ({
    userId: userId,
    todoId: todoId
  });

  try {
    deleteTodo(todoCompositeId);
  }
  catch (error) {
    logger.error("Error deleting Todo Item", error);
    return {
      statusCode: 400,
      body: JSON.stringify(error)
    }
  }

  logger.info("Deleted Item by todo ID", todoId);
  return {
    statusCode: 202,
    body: JSON.stringify(todoId)
  }
}
