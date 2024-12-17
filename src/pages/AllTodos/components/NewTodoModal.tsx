import React, { useState } from 'react'
import {
	Modal,
	Backdrop,
	Fade,
	Box,
	Typography,
	TextField,
	Button,
	MenuItem,
} from '@mui/material'
import { addTodo } from '../../../features/todosSlice'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { addDoc, collection } from 'firebase/firestore'
import { db } from '../../../config/firebase'
import { useParams } from 'react-router-dom'

interface NewTodoModalProps {
	open: boolean
  setOpen: (open: boolean) => void,
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
}

export const NewTodoModal: React.FC<NewTodoModalProps> = ({
	open,
  setOpen,
}) => {
  const { user } = useAppSelector((state) => state.auth)
  const { todoListId } = useParams<{ todoListId: string }>()
	const [formData, setFormData] = useState({
		name: '',
		description: '',
		isCompleted: false,
		inProgress: false,
		type: '',
	})

	const handleClose = () => setOpen(false)
	const dispatch = useAppDispatch()

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target
		setFormData({ ...formData, [name]: value })
	}

	const handleSubmit = async () => {
    try {
      const newTodo = {
        ...formData,
        createdAt: new Date().toISOString(),
        userId: user?.userId || '',
        todoListId: todoListId || '',
        assignedTo: [],
      }
      
			await addDoc(collection(db, 'todos'), newTodo)
			dispatch(addTodo(newTodo))
			setOpen(false)
		} catch (error) {}
	}

	return (
		<Modal
			aria-labelledby='transition-modal-title'
			aria-describedby='transition-modal-description'
			open={open}
			onClose={handleClose}
			closeAfterTransition
			slots={{ backdrop: Backdrop }}
			slotProps={{
				backdrop: {
					timeout: 500,
				},
			}}>
			<Fade in={open}>
				<Box sx={style}>
					<Typography
						id='transition-modal-title'
						variant='h6'
						component='h2'
						gutterBottom>
						Create New Todo
					</Typography>
					<TextField
						fullWidth
						label='Name'
						name='name'
						value={formData.name}
						onChange={handleChange}
						margin='normal'
					/>
					<TextField
						fullWidth
						label='Description'
						name='description'
						value={formData.description}
						onChange={handleChange}
						margin='normal'
						multiline
						rows={3}
					/>
					<TextField
						select
						fullWidth
						label='Type'
						name='type'
						value={formData.type}
						onChange={handleChange}
						margin='normal'>
						<MenuItem value='personal'>Personal</MenuItem>
						<MenuItem value='work'>Work</MenuItem>
						<MenuItem value='other'>Other</MenuItem>
					</TextField>
					<Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
						<Button
							variant={formData.inProgress ? 'contained' : 'outlined'}
							color='primary'
							onClick={() =>
								setFormData({ ...formData, inProgress: !formData.inProgress })
							}>
							{formData.inProgress ? 'In Progress' : 'Not In Progress'}
						</Button>
						<Button
							variant={formData.isCompleted ? 'contained' : 'outlined'}
							color='secondary'
							onClick={() =>
								setFormData({ ...formData, isCompleted: !formData.isCompleted })
							}>
							{formData.isCompleted ? 'Completed' : 'Not Completed'}
						</Button>
					</Box>
					<Box sx={{ mt: 3, textAlign: 'right' }}>
						<Button variant='contained' color='primary' onClick={handleSubmit}>
							Create Todo
						</Button>
					</Box>
				</Box>
			</Fade>
		</Modal>
	)
}
