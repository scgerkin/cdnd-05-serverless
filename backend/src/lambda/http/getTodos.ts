import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { getAllTodos } from '../../services/todoService'
import { parseUserId } from '../../auth/utils'

const logger = createLogger('getAllTodos');

// TODO pull auth validation logic into a service to reduce duplication
// TODO Implement middleware for headers/error handling
// TODO Parse ID from JWT to use
// TODO Validate existing ID (consider extracting to a service)

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const authorization = event.headers.Authorization;
  let authParts = authorization.split(' ');

  if (authParts[0].toLowerCase() !== "bearer") {
    logger.error('Invalid authorization header, missing \'Bearer\'', authorization);
    return {
      statusCode: 400,
      body: JSON.stringify({error: 'Invalid authorization header.'})
    }
  }

  const token = authParts[1];
  logger.info('JWT Token', token);

  if (!!token) {
    logger.error('Missing JWT', authorization);
    return {
      statusCode: 400,
      body: JSON.stringify({error: 'Invalid or missing auth token.'})
    }
  }

  // TODO parse from jwt
  //const userId = parseUserId(token);
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
