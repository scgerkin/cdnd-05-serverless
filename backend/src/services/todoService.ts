import * as uuid from 'uuid'
import {TodoItem} from '../models/TodoItem'
import {TodoUpdate} from '../models/TodoUpdate'
import { parseUserId } from '../auth/utils'
import {TodoRepository} from '../repository/todoRepository'
import { CreateTodoRequest } from '../requests/CreateTodoRequest';
import { TodoCompositeId } from '../models/TodoCompositeId'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const repo = new TodoRepository();

export async function getAllTodos(jwtToken: string): Promise<TodoItem[]> {
  const userId = parseUserId(jwtToken);
  return repo.getAllByUserId(userId);
}

export async function createNew(createTodo: CreateTodoRequest, jwtToken: string): Promise<TodoItem> {

  const newTodo: TodoItem = ({
    userId: parseUserId(jwtToken),//FIXME should take user id directly not token
    todoId: uuid.v4(),
    createdAt: String(new Date()),
    name: createTodo.name,
    dueDate: createTodo.dueDate, // CONSIDER validating is date & not before current
    done: false
  });

  return repo.put(newTodo);
}

export async function deleteTodo(todoId: string, jwtToken: string) {
  const deleteRequest: TodoCompositeId = ({
    userId: parseUserId(jwtToken),//FIXME should take user id directly not token
    todoId: todoId
  });

  return repo.delete(deleteRequest);
}

export async function updateExisting(updateTodo: UpdateTodoRequest, compositeId: TodoCompositeId): Promise<TodoItem> {
  const existingItem = await repo.getByTodoId(compositeId.todoId);

  if (existingItem.userId !== compositeId.userId) {
    throw new Error('That item does not belong to the current user.');
  }

  const putTodo: TodoItem = ({
    userId: existingItem.userId,
    todoId: existingItem.todoId,
    createdAt: existingItem.createdAt,
    name: updateTodo.name,
    dueDate: updateTodo.dueDate,
    done: updateTodo.done,
    attachmentUrl: existingItem.attachmentUrl
  });

  return await repo.put(putTodo);
}
