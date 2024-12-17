import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  IconButton,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { NewTodoModal } from './components/NewTodoModal';
import { EditTodoModal } from './components/EditTodoModal';
import { Todos } from '../../types/Todos';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { deleteTodo, setTodos } from '../../features/todosSlice';
import { db } from '../../config/firebase';
import { useLocation, useParams } from 'react-router-dom';

export const AllTodos: React.FC = () => {
  const { todos } = useAppSelector((state) => state.todos);
  const [openNewTodoModal, setOpenNewTodoModal] = useState(false);
  const [openEditTodoModal, setOpenEditTodoModal] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todos | null>(null);
  const { todoListId } = useParams<{ todoListId: string }>();
  const location = useLocation();
  const { list } = location.state || {};
  const dispatch = useAppDispatch();

  const tableHeadings = [
    'Todo',
    'Type',
    'In Progress',
    'Completed',
    'Contributors',
    'Created At',
    'Actions',
  ];

  const handleOpen = () => setOpenNewTodoModal(true);

  const handleOpenEditing = (todo: Todos) => {
    setSelectedTodo(todo);
    setOpenEditTodoModal(true);
  };

  const handleDeleteTodo = async (todoId: string) => {
    try {
      await deleteDoc(doc(db, 'todos', todoId));
      dispatch(deleteTodo(todoId));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const formatContributors = (contributors: { name?: string; email?: string }[] = []) => {
    if (!contributors.length) return 'No contributors';
    return contributors.map((c) => c.name || c.email).join(', ');
  };

  useEffect(() => {
    const fetchTodos = async () => {
      if (!todoListId) return;

      const todosQuery = query(collection(db, 'todos'), where('todoListId', '==', todoListId));

      try {
        const querySnapshot = await getDocs(todosQuery);
        const fetchedTodos = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Todos[];

        dispatch(setTodos(fetchedTodos));
      } catch (error) {
        console.error('Error fetching todos: ', error);
      }
    };

    fetchTodos();
  }, [dispatch, todoListId]);

  return (
    <TableContainer component={Paper}>
      <NewTodoModal open={openNewTodoModal} setOpen={setOpenNewTodoModal} />

      {selectedTodo && (
        <EditTodoModal
          todo={selectedTodo}
          list={list}
          open={openEditTodoModal}
          setOpen={setOpenEditTodoModal}
        />
      )}

      <div className="table-box" style={{ display: 'flex', justifyContent: 'space-between', margin: '16px' }}>
        <Typography variant="h3" sx={{ m: 2 }}>
          Todos Table
        </Typography>
        <Button variant="contained" sx={{ bgcolor: 'black' }} onClick={handleOpen}>
          <AddCircleOutlineIcon />
          &nbsp; New todo
        </Button>
      </div>

      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
            {tableHeadings.map((heading, index) => (
              <TableCell
                key={index}
                sx={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  color: '#3f51b5',
                }}
              >
                {heading}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {todos.map((todo, index) => (
            <TableRow key={todo.id || `todo-${index}`}>
              <TableCell sx={{ textAlign: 'center' }}>{todo.name}</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>{todo.type}</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>
                {todo.inProgress ? 'In Progress' : 'Not Started'}
              </TableCell>
              <TableCell sx={{ textAlign: 'center' }}>
                {todo.isCompleted ? 'Completed' : 'Not Completed'}
              </TableCell>
              <TableCell sx={{ textAlign: 'center' }}>
                {formatContributors(list.contributors)}
              </TableCell>
              <TableCell sx={{ textAlign: 'center' }}>
                {todo.createdAt ? new Date(todo.createdAt).toLocaleString() : 'N/A'}
              </TableCell>
              <TableCell sx={{ textAlign: 'center' }}>
                <IconButton color="primary" onClick={() => handleOpenEditing(todo)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => handleDeleteTodo(todo.id!)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
