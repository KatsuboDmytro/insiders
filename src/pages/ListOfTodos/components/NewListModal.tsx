import React, { useState } from 'react';
import {
  Modal,
  Backdrop,
  Fade,
  Box,
  Typography,
  TextField,
  Button,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { addTodoList } from '../../../features/listSlice';
import useNotification from '../../../app/useNotification';

interface NewListModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export const NewListModal: React.FC<NewListModalProps> = ({
  open,
  setOpen,
}) => {
  const { showError } = useNotification();
  const { user } = useAppSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    userId: user?.userId || '',
    contributors: [],
  });

  const handleClose = () => setOpen(false);
  const dispatch = useAppDispatch();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      showError('Title and description cannot be empty.');
      return;
    }
  
    if (!user?.userId) {
      console.error('User ID is missing');
      return;
    }
  
    try {
      const newList = {
        ...formData,
        title: formData.title,
        description: formData.description,
        userId: user.userId,
        contributors: formData.contributors,
      };
  
      const docRef = await addDoc(collection(db, 'todoList'), newList);
      const createdList = { ...newList, id: docRef.id };
  
      dispatch(addTodoList(createdList));
      setOpen(false);
    } catch (error) {
      console.error('Error creating Todo List:', error);
      showError((error as any).message || 'An error occurred');
    }
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Box sx={style}>
          <Typography
            id="transition-modal-title"
            variant="h6"
            component="h2"
            gutterBottom
          >
            Create New List
          </Typography>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={3}
          />
          <Box sx={{ mt: 3, textAlign: 'right' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              Create List
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};
