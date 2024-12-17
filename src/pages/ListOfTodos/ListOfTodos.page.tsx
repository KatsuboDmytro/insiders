import React, { useState } from 'react';
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
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { useNavigate } from 'react-router-dom';
import { db } from '../../config/firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { deleteTodoList } from '../../features/listSlice';
import { NewListModal } from './components/NewListModal';
import { EditListModal } from './components/EditListModal';
import { Contributor } from '../../types/User';

export const ListOfTodos: React.FC = () => {
  const { lists } = useAppSelector((state) => state.lists);
  const [openNewListModal, setOpenNewListModal] = useState(false);
  const [openEditListModal, setOpenEditListModal] = useState(false);
  const [selectedList, setSelectedList] = useState<any>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const tableHeadings = ['Title', 'Contributors', 'Actions'];

  const handleOpen = () => setOpenNewListModal(true);
  const handleOpenEdit = (list: any) => {
    setSelectedList(list);
    setOpenEditListModal(true);
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;

    try {
      await deleteDoc(doc(db, 'todoList', id));
      dispatch(deleteTodoList(id));
    } catch (error) {
      console.error('Error deleting the list:', error);
    }
  };

  const formatContributors = (contributors: Contributor[] = []) => {
    if (contributors.length === 0) return 'No contributors';
    return contributors.map((c) => c.name || c.email).join(', ');
  };

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
      <NewListModal open={openNewListModal} setOpen={setOpenNewListModal} />
      {selectedList && (
        <EditListModal
          list={selectedList}
          open={openEditListModal}
          setOpen={setOpenEditListModal}
        />
      )}

      <div
        className="table-box"
        style={{ display: 'flex', justifyContent: 'space-between', margin: '16px' }}
      >
        <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
          All lists
        </Typography>
        <Button variant="contained" sx={{ bgcolor: 'black' }} onClick={handleOpen}>
          <AddCircleOutlineIcon />
          &nbsp; New list
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
                  fontSize: '1rem',
                }}
              >
                {heading}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {lists.map((list, index) => (
            <TableRow
              key={list.id || `list-${index}`}
              sx={{
                '&:hover': { backgroundColor: '#e3f2fd', cursor: 'pointer' },
              }}
            >
              <TableCell
                onClick={() => navigate(`/list/${list.id}`, { state: { list } })}
                sx={{ textAlign: 'center', fontWeight: '500', fontSize: '1rem' }}
              >
                {list.title}
              </TableCell>
              <TableCell
                onClick={() => navigate(`/list/${list.id}`, { state: { list } })}
                sx={{ textAlign: 'center' }}
              >
                {formatContributors(list.contributors)}
              </TableCell>
              <TableCell sx={{ textAlign: 'center' }}>
                <IconButton
                  color="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenEdit(list);
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(list.id);
                  }}
                >
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
