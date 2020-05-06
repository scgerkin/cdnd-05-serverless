import * as uuid from 'uuid'
import {TodoItem} from '../models/TodoItem'
import {TodoRepository} from '../repository/todoRepository'
import { CreateTodoRequest } from '../requests/CreateTodoRequest';
import { TodoCompositeId } from '../models/TodoCompositeId'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'

const logger = createLogger('TodoService');

const repo = new TodoRepository();

export async function getAllTodos(userId: string): Promise<TodoItem[]> {
  return repo.getAllByUserId(userId);
}

export async function createNew(createTodo: CreateTodoRequest, userId: string): Promise<TodoItem> {

  const newTodo: TodoItem = ({
    userId: userId,
    todoId: uuid.v4(),
    createdAt: String(new Date()),
    name: createTodo.name,
    dueDate: createTodo.dueDate, // CONSIDER validating is date & not before current
    done: false
  });

  return repo.put(newTodo);
}

export async function deleteTodo(todoCompositeId: TodoCompositeId) {
  return repo.delete(todoCompositeId);
}

export async function updateExisting(updateTodo: UpdateTodoRequest, compositeId: TodoCompositeId): Promise<TodoItem> {
  const existingItem = await repo.getByTodoId(compositeId);

  logger.debug("Get existing item", existingItem);

  if (existingItem.userId !== compositeId.userId) {
    logger.error("Existing item user ID did not match request ID");
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

  logger.debug("putTodo", putTodo);

  return await repo.put(putTodo);
}
