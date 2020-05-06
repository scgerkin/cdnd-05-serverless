import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { extractJwt } from '../utils'
import { deleteTodo } from '../../services/todoService';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  let jwt: string;
  try {
    jwt = extractJwt(event);
  }
  catch (error) {
    console.log(error);
    return {
      statusCode: 400,
      body: JSON.stringify(error)
    }
  }

  try {
    deleteTodo(todoId, jwt);
  }
  catch (error) {
    console.log(error);
  }

  return {
    statusCode: 202,
    body: JSON.stringify(todoId)
  }
}
