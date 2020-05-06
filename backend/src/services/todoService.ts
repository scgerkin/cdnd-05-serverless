import * as uuid from 'uuid'
import {TodoItem} from '../models/TodoItem'
import {TodoUpdate} from '../models/TodoUpdate'
import { parseUserId } from '../auth/utils'
import {TodoRepository} from '../repository/todoRepository'
import { CreateTodoRequest } from '../requests/CreateTodoRequest';
import { DeleteTodoRequest } from '../requests/DeleteTodoRequest'

const repo = new TodoRepository();

export async function getAllTodos(jwtToken: string): Promise<TodoItem[]> {
  const userId = getUserId(jwtToken);
  return repo.getAllByUser(userId);
}

export async function createNew(createTodo: CreateTodoRequest, jwtToken: string): Promise<TodoItem> {

  const newTodo: TodoItem = ({
    userId: getUserId(jwtToken),
    todoId: uuid.v4(),
    createdAt: String(new Date()),
    name: createTodo.name,
    dueDate: createTodo.dueDate, // CONSIDER validating is date & not before current
    done: false
  });

  return repo.addNew(newTodo);
}

export async function deleteTodo(todoId: string, jwtToken: string) {
  const deleteRequest: DeleteTodoRequest = ({
    userId: getUserId(jwtToken),
    todoId: todoId
  });

  return repo.delete(deleteRequest);
}

function getUserId(jwtToken: string): string {
  //FIXME
  //return parseUserId(jwtToken);
  return "001";
}
