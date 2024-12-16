import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types/User';


export interface ActionState {
  user: User | null;
}

const loadStateFromLocalStorage = (): ActionState => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  return { user };
};

const saveStateToLocalStorage = (state: ActionState) => {
  localStorage.setItem('user', JSON.stringify(state.user));
};

const initialState: ActionState = loadStateFromLocalStorage();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state: ActionState, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      saveStateToLocalStorage(state);
    },
    init: (state: ActionState) => {
      const loadedState = loadStateFromLocalStorage();
      state.user = loadedState.user;
    },
  },
});

export const {
  setUser,
} = authSlice.actions;

export default authSlice.reducer;
