import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { getAllTodos } from '../../services/todoService'
import { parseUserId } from '../../auth/utils'
import { extractJwt } from '../utils'

const logger = createLogger('getAllTodos');

// TODO Implement middleware for headers/error handling
// TODO Parse ID from JWT to use
// TODO Validate existing ID (consider extracting to a service)

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  let jwt: string;
  try {
    jwt = extractJwt(event);
  }
  catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify(error)
    }
  }

  // TODO parse from jwt
  //const userId = parseUserId(jwt);
  const userId = '001';
  logger.info('userId', userId);

  const result = await getAllTodos(userId);
  logger.info("Result", result);

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(result)
  }
}
