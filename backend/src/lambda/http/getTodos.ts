import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { getAllTodos } from '../../services/todoService'
import { getUserId } from '../utils'

const logger = createLogger('getAllTodos');

// TODO Implement middleware for headers/error handling

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  let userId: string;
  try {
    userId = getUserId(event);
    logger.debug('userId', userId);
  }
  catch (error) {
    logger.error("Error retrieving User ID", error);
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(error)
    }
  }


  const result = await getAllTodos(userId);
  logger.info("Result", result);

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({"items": result})
  }
}
