import React, { useState, useEffect } from "react";
import {
  Modal,
  Backdrop,
  Fade,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  SelectChangeEvent,
  ListItemText,
  Checkbox,
} from "@mui/material";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../../../config/firebase";
import { useAppDispatch } from "../../../app/hooks";
import { TodoList } from "../../../types/Todos";
import { updateTodoList } from "../../../features/listSlice";
import { User } from "../../../types/User";
import { useAuth } from "../../../app/useAuth";

interface EditListModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  list: TodoList;
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export const EditListModal: React.FC<EditListModalProps> = ({ open, setOpen, list }) => {
  const dispatch = useAppDispatch();
  const { getAllUsers } = useAuth({});
  const [users, setUsers] = useState<User[]>([]);

  const [formData, setFormData] = useState({
    title: list?.title || "",
    description: list?.description || "",
    contributors: list?.contributors || [],
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersList = await getAllUsers();
        setUsers(usersList as User[]);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [getAllUsers]);

  useEffect(() => {
    if (list) {
      setFormData({
        title: list.title || "",
        description: list.description || "",
        contributors: list.contributors || [],
      });
    }
  }, [list]);

  const handleClose = () => setOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContributorsChange = (event: SelectChangeEvent<string[]>) => {
    const selectedEmails = event.target.value as string[];
    const selectedContributors = users.filter((user) =>
      selectedEmails.includes(user.email)
    );
    setFormData((prev) => ({ ...prev, contributors: selectedContributors }));
  };

  const handleSubmit = async () => {
    try {
      const updatedTodo = {
        ...formData,
        name: formData.title,
        contributors: formData.contributors,
        userId: list.userId,
      };

      await updateDoc(doc(db, "todoList", list.id!), updatedTodo);
      dispatch(updateTodoList({ id: list.id, ...updatedTodo }));
      setOpen(false);
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 500 } }}
    >
      <Fade in={open}>
        <Box sx={style}>
          <Typography variant="h6" component="h2" gutterBottom>
            Edit Todo
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
          <FormControl fullWidth margin="normal">
            <InputLabel id="contributors-label">Contributors</InputLabel>
            <Select
              labelId="contributors-label"
              multiple
              value={formData.contributors.map((c) => c.email)}
              onChange={handleContributorsChange}
              renderValue={(selected) =>
                selected
                  .map((email) => users.find((user) => user.email === email)?.name || email)
                  .join(", ")
              }
            >
              {users.map((user) => (
                <MenuItem key={user.userId} value={user.email}>
                  <Checkbox
                    checked={formData.contributors.some((c) => c.email === user.email)}
                  />
                  <ListItemText
                    primary={user.name || user.email}
                    secondary={user.email}
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ mt: 3, textAlign: "right" }}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Save Changes
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};
