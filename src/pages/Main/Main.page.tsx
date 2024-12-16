import React, { useEffect, useState } from 'react'
import { Todos } from '../../types/Todos'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../config/firebase'
import useNotification from '../../app/useNotification'
import './dashboard.css';
import './nav.css';
import { Box, Typography } from '@mui/material';
import { setTodos } from '../../features/todosSlice'
import { useAppDispatch } from '../../app/hooks'

export const Main:React.FC = () => {
  const [todosList, setTodosList] = useState<Todos[]>([])
  const todosCollectionRef = collection(db, 'todos')
	const { showError } = useNotification()
  const dispatch = useAppDispatch()

  useEffect(() => {
    const getTodosList = async () => {
      try {
        const data = await getDocs(todosCollectionRef);
        const filteredData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setTodosList(filteredData as Todos[]);
        dispatch(setTodos(filteredData as Todos[]));
      } catch (error) {
        showError((error as any).message);
      }
    }
    getTodosList();
  }, []);

  return (
    <>
      <Typography
        variant="h3"
        className='MuiTypography-h3'
      >
        Todos
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 2,
          mt: 4,
        }}
      >
        <Box
          sx={{
            flex: 1,
            p: 2,
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            textAlign: 'center',
            boxShadow: 1,
          }}
        >
          <Typography variant="h6" component="h2">
            All Todos
          </Typography>
          <Typography variant="h4" component="p" color="primary">
            {todosList.length}
          </Typography>
        </Box>
        <Box
          sx={{
            flex: 1,
            p: 2,
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            textAlign: 'center',
            boxShadow: 1,
          }}
        >
          <Typography variant="h6" component="h2">
            Completed
          </Typography>
          <Typography variant="h4" component="p" color="success.main">
            {todosList.filter(todo => todo.isCompleted).length}/{todosList.length}
          </Typography>
        </Box>
        <Box
          sx={{
            flex: 1,
            p: 2,
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            textAlign: 'center',
            boxShadow: 1,
          }}
        >
          <Typography variant="h6" component="h2">
            In Progress
          </Typography>
          <Typography variant="h4" component="p" color="warning.main">
            {todosList.filter(todo => todo.inProgress).length}/{todosList.length}
          </Typography>
        </Box>
      </Box>
    </>
  )
}
