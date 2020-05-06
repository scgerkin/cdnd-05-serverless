import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { extractJwt } from '../../utils/jwtExtractor'
import { createNew } from '../../services/todoService'
import { TodoItem } from '../../models/TodoItem'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('create called');

  // TODO validate request
  const createTodoRequest: CreateTodoRequest = JSON.parse(event.body);

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

  const newTodo: TodoItem = await createNew(createTodoRequest, jwt);

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(newTodo)
  }
}
