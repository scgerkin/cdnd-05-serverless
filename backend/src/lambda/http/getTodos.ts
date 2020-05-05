import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { getAllTodos } from '../../services/todoService'
import { parseUserId } from '../../auth/utils'

const logger = createLogger('getAllTodos');


// TODO: Get all TODO items for a current user
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info("Received event", event);

  // parse id from token
  const token = event.headers.Authorization.split(' ')[1]
  logger.info("Token", token);
  // FIXME
  //const userId = parseUserId(token);
  const userId = '001';

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
