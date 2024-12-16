import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Typography,
} from '@mui/material';
import { useAppSelector } from '../../app/hooks';

type Props = {}

export const AllTodos: React.FC = (props: Props) => {
  const { todos } = useAppSelector((state) => state.todos);

  return (
    <TableContainer component={Paper}>
      <Typography variant="h6" sx={{ m: 2 }}>
        Todos Table
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Todo</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>In Progress</TableCell>
            <TableCell>Completed</TableCell>
            <TableCell>Created At</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {todos.map((todo) => (
            <TableRow key={todo.id}>
              <TableCell>{todo.name}</TableCell>
              <TableCell>{todo.type}</TableCell>
              <TableCell>
                {todo.inProgress ? (
                  <span className='progress'>progress</span>
                ) : (
                  <span className='no-progress'>not started</span>
                )}
              </TableCell>
              <TableCell>
                {!todo.isCompleted ? (
                  <span className='completed'>completed</span>
                ) : (
                  <span className='not-completed'>not completed</span>
                )}
              </TableCell>
              <TableCell>{new Date(todo.createdAt).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
