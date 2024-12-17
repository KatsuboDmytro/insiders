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
  Checkbox,
  ListItemText,
  SelectChangeEvent,
} from "@mui/material";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../../../config/firebase";
import { useAppDispatch } from "../../../app/hooks";
import { TodoList, Todos } from "../../../types/Todos";
import { updateTodo } from "../../../features/todosSlice";
import { User } from "../../../types/User";
import { useAuth } from "../../../app/useAuth";

interface EditTodoModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  todo: Todos;
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

export const EditTodoModal: React.FC<EditTodoModalProps> = ({
  open,
  setOpen,
  todo,
  list,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isCompleted: false,
    inProgress: false,
    type: "",
    contributors: [] as User[],
  });

  const dispatch = useAppDispatch();
  const { getAllUsers } = useAuth({});
  const [users, setUsers] = useState<User[]>([]);

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
    if (todo) {
      setFormData({
        name: todo.name,
        description: todo.description,
        isCompleted: todo.isCompleted,
        inProgress: todo.inProgress,
        type: todo.type,
        contributors: list?.contributors || [],
      });
    }
  }, [todo, open]);

  const handleClose = () => setOpen(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleContributorsChange = (
    event: SelectChangeEvent<string[]>
  ) => {
    const selectedEmails = event.target.value as string[];
    const selectedContributors = users.filter((user) =>
      selectedEmails.includes(user.email)
    );
    setFormData({ ...formData, contributors: selectedContributors });
  };

  const handleSubmit = async () => {
    if (!todo) return;

    try {
      const updatedTodo = {
        ...formData,
        assignedTo: todo.assignedTo || [],
        userId: todo.userId,
        todoListId: todo.todoListId,
      };

      await updateDoc(doc(db, "todos", todo.id!), updatedTodo);
      dispatch(updateTodo({ id: todo.id, ...updatedTodo }));
      setOpen(false);
    } catch (error) {
      console.error("Error updating todo:", error);
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
          <Typography id="transition-modal-title" variant="h6" component="h2" gutterBottom>
            Edit Todo
          </Typography>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
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
          <TextField
            select
            fullWidth
            label="Type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            margin="normal"
          >
            <MenuItem value="personal">Personal</MenuItem>
            <MenuItem value="work">Work</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </TextField>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button
              variant={formData.inProgress ? "contained" : "outlined"}
              color="primary"
              onClick={() => setFormData({ ...formData, inProgress: !formData.inProgress })}
            >
              {formData.inProgress ? "In Progress" : "Not In Progress"}
            </Button>
            <Button
              variant={formData.isCompleted ? "contained" : "outlined"}
              color="secondary"
              onClick={() => setFormData({ ...formData, isCompleted: !formData.isCompleted })}
            >
              {formData.isCompleted ? "Completed" : "Not Completed"}
            </Button>
          </Box>
          
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
