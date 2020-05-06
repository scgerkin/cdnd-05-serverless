import * as uuid from 'uuid'
import {TodoItem} from '../models/TodoItem'
import {TodoUpdate} from '../models/TodoUpdate'
import { parseUserId } from '../auth/utils'
import {TodoRepository} from '../repository/todoRepository'
import { CreateTodoRequest } from '../requests/CreateTodoRequest';

const repo = new TodoRepository();

export async function getAllTodos(jwtToken: string): Promise<TodoItem[]> {
  const userId = getUserId(jwtToken);
  return repo.getAllTodos(userId);
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

  return repo.createTodo(newTodo);
}

function getUserId(jwtToken: string): string {
  //FIXME
  //return parseUserId(jwtToken);
  return "001";
}
