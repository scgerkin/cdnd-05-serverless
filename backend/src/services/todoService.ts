import * as uuid from 'uuid'
import {TodoItem} from '../models/TodoItem'
import {TodoUpdate} from '../models/TodoUpdate'

import {TodoRepository} from '../repository/todoRepository'

const repo = new TodoRepository();

export async function getAllTodos(userId): Promise<TodoItem[]> {
  return repo.getAllTodos(userId);
}
