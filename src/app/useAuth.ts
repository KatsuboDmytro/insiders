import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signInWithPopup,
	signOut,
	onAuthStateChanged,
} from 'firebase/auth';
import { useEffect, useCallback } from 'react';

import useNotification from './useNotification';
import { setUser } from '../features/authSlice';
import { useAppDispatch } from './hooks';
import { auth, googleProvider } from '../config/firebase';
import { accessTokenService } from '../services/access/accessTokenService';
import { useNavigate } from 'react-router-dom';

interface AuthProps {
	email?: string;
	password?: string;
}

export const useAuth = ({ email, password }: AuthProps) => {
	const { showSuccess, showError } = useNotification();
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (user) {
				const token = await user.getIdToken();
				const userData = {
					email: user.email || '',
					img: user.photoURL || '',
					name: user.displayName || 'Guest',
				};
				dispatch(setUser(userData));
				accessTokenService.save(token);
			} else {
				dispatch(setUser(null));
				accessTokenService.remove();
			}
		});

		return () => unsubscribe();
	}, [dispatch]);

	const handleSignup = useCallback(
		async (e: React.FormEvent) => {
			e.preventDefault();
			try {
				const userCredential = await createUserWithEmailAndPassword(
					auth,
					email || '',
					password || ''
				);
				const user = {
					email: userCredential.user.email || '',
					img: userCredential.user.photoURL || '',
					name: userCredential.user.displayName || 'Guest',
				};
				dispatch(setUser(user));
				const token = await userCredential.user.getIdToken();
				accessTokenService.save(token);
				navigate('/');
				showSuccess('Signup successful');
			} catch (error) {
				showError((error as any).message);
			}
		},
		[email, password, dispatch, navigate, showSuccess, showError]
	);

	const handleSignupWithGoogle = useCallback(async () => {
		try {
			const userCredential = await signInWithPopup(auth, googleProvider);
			const user = {
				email: userCredential.user.email || '',
				img: userCredential.user.photoURL || '',
				name: userCredential.user.displayName || 'Guest',
			};
			dispatch(setUser(user));
			const token = await userCredential.user.getIdToken();
			accessTokenService.save(token);
			navigate('/');
			showSuccess('Signup successful');
		} catch (error) {
			showError((error as any).message);
		}
	}, [dispatch, navigate, showSuccess, showError]);

	const handleLogin = useCallback(
		async (e: React.FormEvent) => {
			e.preventDefault();
			try {
				const userCredential = await signInWithEmailAndPassword(
					auth,
					email || '',
					password || ''
				);
				const user = {
					email: userCredential.user.email || '',
					img: userCredential.user.photoURL || '',
					name: userCredential.user.displayName || 'Guest',
				};
				dispatch(setUser(user));
				const token = await userCredential.user.getIdToken();
				accessTokenService.save(token);
				navigate('/');
				showSuccess('Login successful');
			} catch (error) {
				showError((error as any).message);
			}
		},
		[email, password, dispatch, navigate, showSuccess, showError]
	);

	const handleGoogleLogin = useCallback(async () => {
		try {
			const userCredential = await signInWithPopup(auth, googleProvider);
			const user = {
				email: userCredential.user.email || '',
				img: userCredential.user.photoURL || '',
				name: userCredential.user.displayName || 'Guest',
			};
			dispatch(setUser(user));
			const token = await userCredential.user.getIdToken();
			accessTokenService.save(token);
			navigate('/');
			showSuccess('Google login successful');
		} catch (error) {
			showError((error as any).message);
		}
	}, [dispatch, navigate, showSuccess, showError]);

	const handleLogout = useCallback(
		async (e: React.FormEvent) => {
			e.preventDefault();
			try {
				await signOut(auth);
				dispatch(setUser(null));
				accessTokenService.remove();
				navigate('/login');
				showSuccess('Log out successful');
			} catch (error) {
				showError((error as any).message);
			}
		},
		[dispatch, navigate, showSuccess, showError]
	);

	return {
		handleSignup,
		handleSignupWithGoogle,
		handleLogin,
		handleGoogleLogin,
		handleLogout,
	};
};
