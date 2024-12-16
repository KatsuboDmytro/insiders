import React, { useState } from 'react'
import {
	Box,
	TextField,
	Button,
	Typography,
	Container,
	useTheme,
} from '@mui/material'
import GoogleIcon from '@mui/icons-material/Google'
import { useAuth } from '../../app/useAuth'

export const Signup: React.FC = () => {
	const theme = useTheme()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const { handleSignup, handleSignupWithGoogle, handleLogout } = useAuth({
		email,
		password,
	})

	return (
		<Container maxWidth='xs'>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					mt: 8,
					p: 3,
					boxShadow: 3,
					borderRadius: 2,
				}}>
				<Typography
					variant='h5'
					component='h1'
					gutterBottom
					sx={{ color: theme.palette.text.primary }}>
					Signup
				</Typography>
				<form onSubmit={handleSignup} style={{ width: '100%' }}>
					<TextField
						label='Email'
						type='email'
						fullWidth
						margin='normal'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
					<TextField
						label='Password'
						type='password'
						fullWidth
						margin='normal'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
					<Button
						type='submit'
						variant='contained'
						color='primary'
						fullWidth
						sx={{ mt: 2 }}>
						Signup
					</Button>
				</form>
				<Button
					type='submit'
					variant='contained'
					color='primary'
					fullWidth
					sx={{ mt: 2 }}
					onClick={handleSignupWithGoogle}>
					<GoogleIcon />
					Увійти за допомогою Google
				</Button>
			</Box>
		</Container>
	)
}
