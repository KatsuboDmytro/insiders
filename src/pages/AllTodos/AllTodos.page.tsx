import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';
import { useAppSelector } from '../../app/hooks';

export const AllTodos: React.FC = () => {
  const { todos } = useAppSelector((state) => state.todos);

  const tableHeadings = ['Todo', 'Type', 'In Progress', 'Completed', 'Created At'];
  const cellStyle = { textAlign: 'center', fontWeight: 'bold', color: '#3f51b5' };

  return (
    <TableContainer component={Paper}>
      <Typography variant="h3" sx={{ m: 2 }}>
        Todos Table
      </Typography>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
            {tableHeadings.map((heading) => (
              <TableCell key={heading} sx={cellStyle}>
                {heading}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {todos.map((todo) => (
            <TableRow key={todo.id}>
              <TableCell sx={{ textAlign: 'center' }}>{todo.name}</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>{todo.type}</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>
                <span className={todo.inProgress ? 'progress' : 'no-progress'}>
                  {todo.inProgress ? 'progress' : 'not started'}
                </span>
              </TableCell>
              <TableCell sx={{ textAlign: 'center' }}>
                <span className={!todo.isCompleted ? 'completed' : 'not-completed'}>
                  {!todo.isCompleted ? 'completed' : 'not completed'}
                </span>
              </TableCell>
              <TableCell sx={{ textAlign: 'center' }}>
                {new Date(todo.createdAt).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
