import React, { useEffect, useState } from 'react';
import { TodoList, Todos } from '../../types/Todos';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import useNotification from '../../app/useNotification';
import './dashboard.css';
import './nav.css';
import { Box, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setTodoList } from '../../features/listSlice';

export const Main: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { lists } = useAppSelector((state) => state.lists);
  const [tempTodos, setTempTodos] = useState<Todos[]>([]);
  const listsCollectionRef = collection(db, 'todoList');
  const todosCollectionRef = collection(db, 'todos');
  const { showError } = useNotification();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getTodosLists = async () => {
      if (!user?.userId) return;
      try {
        const q = query(listsCollectionRef, where('userId', '==', user.userId));
        const data = await getDocs(q);
  
        const filteredLists = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
  
        dispatch(setTodoList(filteredLists as TodoList[]));
  
        const allTodos: Todos[] = [];
  
        for (const list of filteredLists) {
          const todosQuery = query(todosCollectionRef, where('todoListId', '==', list.id));
          const todosData = await getDocs(todosQuery);
  
          const filteredTodos = todosData.docs.map((doc) => ({
            ...(doc.data() as Todos),
            id: doc.id,
          }));
  
          allTodos.push(...filteredTodos);
        }
  
        setTempTodos(allTodos);
      } catch (error) {
        showError((error as any).message);
      }
    };
  
    getTodosLists();
  }, [user?.userId, dispatch, showError]);
  
  return (
    <>
      <Typography variant="h3" className='MuiTypography-h3'>
        Todos
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mt: 4 }}>
        <Box sx={{ flex: 1, p: 2, backgroundColor: '#f5f5f5', borderRadius: '8px', textAlign: 'center', boxShadow: 1 }}>
          <Typography variant="h6" component="h2">All lists</Typography>
          <Typography variant="h4" component="p" color="primary">{lists.length}</Typography>
        </Box>
        <Box sx={{ flex: 1, p: 2, backgroundColor: '#f5f5f5', borderRadius: '8px', textAlign: 'center', boxShadow: 1 }}>
          <Typography variant="h6" component="h2">All Todos</Typography>
          <Typography variant="h4" component="p" color="primary">{tempTodos.length}</Typography>
        </Box>
        <Box sx={{ flex: 1, p: 2, backgroundColor: '#f5f5f5', borderRadius: '8px', textAlign: 'center', boxShadow: 1 }}>
          <Typography variant="h6" component="h2">Completed</Typography>
          <Typography variant="h4" component="p" color="success.main">
            {tempTodos.filter(todo => todo.isCompleted).length}/{tempTodos.length}
          </Typography>
        </Box>
        <Box sx={{ flex: 1, p: 2, backgroundColor: '#f5f5f5', borderRadius: '8px', textAlign: 'center', boxShadow: 1 }}>
          <Typography variant="h6" component="h2">In Progress</Typography>
          <Typography variant="h4" component="p" color="warning.main">
            {tempTodos.filter(todo => todo.inProgress).length}/{tempTodos.length}
          </Typography>
        </Box>
      </Box>
    </>
  );
};
