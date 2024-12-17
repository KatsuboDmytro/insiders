import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Todos } from '../types/Todos';

export interface TodosState {
  todos: Todos[];
}

const initialState: TodosState = {
  todos: [],
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setTodos: (state, action: PayloadAction<Todos[]>) => {
      state.todos = action.payload;
    },
    addTodo: (state, action: PayloadAction<Todos>) => {
      state.todos.push(action.payload);
    },
    updateTodo: (state, action: PayloadAction<Todos>) => {
      const index = state.todos.findIndex(
        (todo) => todo.id === action.payload.id
      );
      if (index !== -1) {
        state.todos[index] = action.payload;
      }
    },
    deleteTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload);
    },
  },
});

export const { setTodos, addTodo, updateTodo, deleteTodo } = todosSlice.actions;
export default todosSlice.reducer;
