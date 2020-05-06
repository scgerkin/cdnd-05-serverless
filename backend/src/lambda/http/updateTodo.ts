import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { updateExisting } from '../../services/todoService'
import { getUserId } from '../utils'
import { TodoItem } from '../../models/TodoItem'
import { TodoCompositeId } from '../../models/TodoCompositeId'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  let compositeId: TodoCompositeId;

  try {
    const userId = getUserId(event);
    compositeId = ({
      todoId: todoId,
      userId: userId
    });
  }
  catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify(error)
    }
  }

  let updatedItem: TodoItem;
  try {
    updatedItem = await updateExisting(updatedTodo, compositeId);
  }
  catch (error) {
    return {
      statusCode: 401,
      body: JSON.stringify(error)
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updatedItem)
  }
}
