import React, { useState } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Avatar,
  InputAdornment,
  Popover,
  Button,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useAppSelector } from '../app/hooks';
import { useAuth } from '../app/useAuth';
import { Link } from 'react-router-dom';

export const UserInfo: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { handleLogout } = useAuth({});
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'logout-popover' : undefined;

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        p: 2,
        width: '400px',
        alignSelf: 'flex-end',
      }}
    >
      {user ? (
        <>
          <TextField
            variant="outlined"
            placeholder="Search..."
            fullWidth
            sx={{
              backgroundColor: 'white',
              borderRadius: '8px',
              width: '300px',
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <IconButton edge="end" sx={{ ml: 2 }} onClick={handleAvatarClick}>
            <Avatar
              src={user?.img || undefined}
              alt={user?.name || 'User'}
              sx={{ width: 40, height: 40 }}
            />
          </IconButton>

          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <Box sx={{ p: 2 }}>
              <Typography variant="body1" gutterBottom>
                {user?.name || 'Guest'}
              </Typography>
              <Button
                variant="contained"
                color="error"
                fullWidth
                onClick={(event) => {
                  handleLogout(event);
                  handleClose();
                }}
              >
                Logout
              </Button>
            </Box>
          </Popover>
        </>
      ) : (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <Button
            component={Link}
            to="/login"
            variant="contained"
            sx={{ mr: 1 }}
          >
            Login
          </Button>
          <Button
            component={Link}
            to="/signup"
            variant="outlined"
          >
            Signup
          </Button>
        </Box>
      )}
    </Box>
  );
};
