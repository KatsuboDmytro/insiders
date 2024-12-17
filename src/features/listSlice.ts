import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TodoList, Todos } from '../types/Todos'

export interface TodosState {
	lists: TodoList[]
	todos: Todos[]
}

const loadTodosFromLocalStorage = (): TodosState => {
	const lists = JSON.parse(localStorage.getItem('lists') || '[]')
	const todos = JSON.parse(localStorage.getItem('todos') || '[]')
	return { lists, todos }
}

const saveTodosToLocalStorage = (state: TodosState) => {
	localStorage.setItem('lists', JSON.stringify(state.lists))
	localStorage.setItem('todos', JSON.stringify(state.todos))
}

const initialState: TodosState = loadTodosFromLocalStorage()

const todosSlice = createSlice({
	name: 'todos',
	initialState,
	reducers: {
		setTodoList: (state, action: PayloadAction<TodoList[]>) => {
			state.lists = action.payload
			saveTodosToLocalStorage(state)
		},
		addTodoList: (state, action: PayloadAction<TodoList>) => {
			state.lists.push(action.payload)
			saveTodosToLocalStorage(state)
		},
		updateTodoList: (state, action: PayloadAction<TodoList>) => {
			const index = state.lists.findIndex(
        (todo) => todo.id === action.payload.id
      );
      if (index !== -1) {
        state.lists[index] = action.payload;
      }
			saveTodosToLocalStorage(state)
		},
		deleteTodoList: (state, action: PayloadAction<string>) => {
			state.lists = state.lists.filter((list) => list.id !== action.payload)
			saveTodosToLocalStorage(state)
		},
	},
})

export const { setTodoList, addTodoList, updateTodoList, deleteTodoList } =
	todosSlice.actions
export default todosSlice.reducer
